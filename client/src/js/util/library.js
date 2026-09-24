// The rewriting systems of the user, kept in the browser between visits.
//   { systems: [{ id, name, json }], currentId }
// `json` is the serialized system (a string), null while it is still empty.
const KEY = 'gturbo.library'
const OLD_SESSION_KEY = 'gturbo.session'

function newId () {
  return 's' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function load () {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw != null) {
      const lib = JSON.parse(raw)
      if (Array.isArray(lib.systems)) {
        if (!lib.systems.some((s) => s.id === lib.currentId)) lib.currentId = null
        return lib
      }
    }
    // a single edit saved by a previous version becomes the first system
    const old = localStorage.getItem(OLD_SESSION_KEY)
    if (old != null) {
      const id = newId()
      localStorage.removeItem(OLD_SESSION_KEY)
      return { systems: [{ id, name: 'Untitled', json: old }], currentId: id }
    }
  } catch (e) {
    console.error('Could not read the saved systems', e)
  }
  return { systems: [], currentId: null }
}

function save (lib) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lib))
  } catch (e) {
    console.error('Could not save the systems', e)
  }
}

// a name not used yet: "name", "name (2)", ...
function uniqueName (lib, name, exceptId) {
  const base = (name || '').trim() || 'Untitled'
  const used = new Set(lib.systems.filter((s) => s.id !== exceptId).map((s) => s.name))
  if (!used.has(base)) return base
  let i = 2
  while (used.has(base + ' (' + i + ')')) i++
  return base + ' (' + i + ')'
}

// How far a rewriting system is defined: every inclusion has to be validated.
//   { rules, inclusions, validated, full }
function status (json) {
  const none = { rules: 0, inclusions: 0, validated: 0, full: false }
  if (!json) return none
  try {
    const graph = JSON.parse(JSON.parse(json).rs)
    const rules = Object.keys(graph.nodes).length
    const flags = Object.values(graph.edges).map((e) => {
      try { return JSON.parse(e.data).validated === true } catch (err) { return false }
    })
    const validated = flags.filter(Boolean).length
    return { rules, inclusions: flags.length, validated, full: rules > 0 && validated === flags.length }
  } catch (e) {
    return none
  }
}

module.exports = { load, save, newId, uniqueName, status }
