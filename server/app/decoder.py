from libgt.data.Graph import Graph


class JSON_decoder:
    """Enumerate the morphisms j1 -> j2 as {"nodeMap": {...}, "edgeMap": {...}}
    expressed with the ids of the client (edges are the undirected ones)."""

    def __init__(self, j1, j2):
        self.inclusions = []
        for inc in Graph.pattern_match(j1.g, j2.g):
            morphism = self.decode(j1, j2, inc.l)
            if morphism is not None:
                self.inclusions.append(morphism)

    @staticmethod
    def decode(j1, j2, l):
        nodeMap, edgeMap = {}, {}
        for k, v in l.items():
            if not isinstance(k, tuple):
                nodeMap[j1.nodeInvMap[k]] = j2.nodeInvMap[v]
        for e, (fwd, bwd) in j1.edgeMap.items():
            target = j2.edgeInvMap[l[fwd]]
            # with parallel edges the two directions could go to different edges
            if bwd is not None and j2.edgeInvMap[l[bwd]] != target:
                return None
            edgeMap[e] = target
        return {"nodeMap": nodeMap, "edgeMap": edgeMap}

    def decoder(self):
        return self.inclusions
