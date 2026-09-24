from libgt.data.Graph import GraphO


class JSON_encoder:
    """Build a libgt graph from the client's JSON (ids may be sparse).

    The graphs of the editor are undirected, libgt graphs are directed: an edge
    {a, b} becomes the two directed edges a -> b and b -> a (a loop stays a
    single edge). Matching symmetric directed graphs is matching undirected ones.
    """

    def __init__(self, js):
        self.json = js
        self.g = GraphO()
        self.nodeMap = {}      # client node id -> libgt node
        self.nodeInvMap = {}
        self.edgeMap = {}      # client edge id -> (forward, backward); backward is None for a loop
        self.edgeInvMap = {}   # libgt edge -> client edge id (both directions)
        self.forward = set()   # the libgt edges that stand for the client edge in the orientation it is drawn
        for n in self.json['nodes']:
            n = int(n)
            v = self.g.add_node()
            self.nodeMap[n] = v
            self.nodeInvMap[v] = n
        for e, edge in self.json['edges'].items():
            i = self.nodeMap[int(edge['src'])]
            j = self.nodeMap[int(edge['dst'])]
            fwd = self.g.add_edge(i, j)
            bwd = None if i == j else self.g.add_edge(j, i)
            self.edgeMap[int(e)] = (fwd, bwd)
            self.edgeInvMap[fwd] = int(e)
            if bwd is not None:
                self.edgeInvMap[bwd] = int(e)
            self.forward.add(fwd)
