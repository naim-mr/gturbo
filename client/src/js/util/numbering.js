// Numbering of the nodes of an undirected graph: { nodeId: rank }, ranks 0..n-1.
//
// The graphs of the rules are undirected, so there is no topological order:
// the nodes are numbered in the order a breadth-first walk meets them, starting
// from the smallest id of each connected component (components taken by
// smallest id, neighbours by id). The numbering only depends on the structure
// and on the ids, so it does not change from one display to the next.
function nodeRanks (graph) {
  const ids = Object.keys(graph.nodes).map((n) => parseInt(n)).sort((a, b) => a - b)
  const neighbours = {}
  for (const n of ids) neighbours[n] = new Set()
  for (const e of Object.keys(graph.edges)) {
    const { src, dst } = graph.edges[e]
    if (neighbours[src] !== undefined && neighbours[dst] !== undefined) {
      neighbours[src].add(dst)
      neighbours[dst].add(src)
    }
  }
  const ranks = {}
  let next = 0
  for (const start of ids) {
    if (ranks[start] !== undefined) continue
    ranks[start] = next++
    const queue = [start]
    while (queue.length > 0) {
      const v = queue.shift()
      for (const w of [...neighbours[v]].sort((a, b) => a - b)) {
        if (ranks[w] === undefined) {
          ranks[w] = next++
          queue.push(w)
        }
      }
    }
  }
  return ranks
}

module.exports = { nodeRanks }
