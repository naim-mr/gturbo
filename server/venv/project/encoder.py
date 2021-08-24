from libgt.data.Graph import Graph, GraphO, GraphM

class JSON_encoder:
    
    def __init__(self,js):
        self.json= js
        self.g=GraphO()
        self.nodeMap={}
        self.edgeMap={}
        self.nodeInvMap={}
        self.edgeInvMap={}
        for n in self.json['nodes']:
            n=int(n)
            v=self.g.add_node()
            self.nodeMap[n]=v
            self.nodeInvMap[v]=n
        for e in self.json['edges']:
            
            i=int(self.json['edges'][e]['src'])
            j=int(self.json['edges'][e]['dst'])
            a=self.g.add_edge(i,j)
            self.edgeMap[int(e)]=a
            self.edgeInvMap[a]=e
