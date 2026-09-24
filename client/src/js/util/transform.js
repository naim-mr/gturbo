var axios = require('axios')
const { SERVER_URL } = require('./config.js')

// What the server needs to transform a graph, read from a saved system
// (the string kept in the library) and the drawn graph (Graph JSON string).
function buildPayload (systemJson, graphJson, steps) {
  const system = JSON.parse(JSON.parse(systemJson).rs)
  const rules = {}
  const names = {}
  for (const id of Object.keys(system.nodes)) {
    const rule = JSON.parse(system.nodes[id].data)
    rules[id] = { lhs: rule.lhs, rhs: rule.rhs }
    names[id] = rule.name || ''
  }
  const inclusions = Object.keys(system.edges).map((e) => {
    const edge = system.edges[e]
    const inc = JSON.parse(edge.data)
    return { sub: String(edge.src), over: String(edge.dst), lgraphI: inc.lgraphI, rgraphI: inc.rgraphI }
  })
  return { payload: { rules, inclusions, graph: JSON.parse(graphJson), steps }, names }
}

// resolves to { steps: [{ nodes: [ids], edges: [{src, dst}] }] };
// rejects with { message, details: [strings] }
async function runTransform (payload, names) {
  try {
    const res = await axios.post(SERVER_URL + '/transform', payload)
    return res.data
  } catch (e) {
    if (e.response && e.response.data && e.response.data.error) {
      const label = (id) => names[id] ? '"' + names[id] + '"' : 'rule ' + id
      const details = (e.response.data.details || []).map((d) => {
        return label(d.sub) + ' → ' + label(d.over) + ': ' + d.message
      })
      throw { message: e.response.data.error, details } // eslint-disable-line no-throw-literal
    }
    throw { message: 'Could not reach the server (is it running?).', details: [] } // eslint-disable-line no-throw-literal
  }
}

module.exports = { buildPayload, runTransform }
