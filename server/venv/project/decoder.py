from libgt.data.Graph import Graph, GraphO, GraphM
import json
class JSON_decoder:
    def __init__(self,j1,j2 ):
        self.incGenerator= Graph.pattern_match(j1.g,j2.g)
        self.inclusions=[]
        for inc in self.incGenerator:
            self.inclusions.append('{')
            cursor= len(self.inclusions)-1
            inNode=True
            self.inclusions[cursor]+='"nodeMap":{'
            for key in inc.l.items():                
                if(isinstance(key[0],tuple)):
                    if(inNode):
                        if(self.inclusions[cursor][len(self.inclusions[cursor])-1]==','):
                            self.inclusions[cursor]= self.inclusions[cursor][0:-1]        
                        self.inclusions[cursor]+='},'
                        self.inclusions[cursor] += '"edgeMap":{'
                        inNode=False
                    self.inclusions[cursor]+='"'+ str(j1.edgeInvMap[key[0]])+'":'+str(j2.edgeInvMap[key[1]])+','
                else : 
                    self.inclusions[cursor]+='"'+str(key[0])+ '":'+str(key[1])+','
                    inNode=True
            if(self.inclusions[cursor][len(self.inclusions[cursor])-1]==','):
                            self.inclusions[cursor]= self.inclusions[cursor][0:-1]          
            self.inclusions[cursor] += '}}'

    def decoder(self):
        
        return json.dumps(self.inclusions)

