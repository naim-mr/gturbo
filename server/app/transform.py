"""Global transformation of a graph by a rewriting system, computed with libgt.

The client sends what the editor holds: the rules, the inclusions between them
(each with its lhs and rhs bindings, in the ids of the client) and the graph to
transform. libgt needs the inclusions closed under composition (see
test/graph.py of gran_turismo), so this module derives the composites itself
and reports the inclusions whose composites disagree.
"""
from libgt.data.Graph import Graph, GraphM
from libgt.engine.PFunctor import FlatPFunctor
from libgt.engine.GT import GT

from .encoder import JSON_encoder

MAX_STEPS = 10
MAX_INCLUSIONS = 5000   # closure under composition
MAX_NODES = 5000        # size of a result


class TransformError(Exception):
    """A problem the user can fix; `details` lists the offending inclusions."""

    def __init__(self, message, details=None):
        super().__init__(message)
        self.message = message
        self.details = details or []


def _compose(a, b):
    """The map 'a then b'."""
    return {k: b[v] for k, v in a.items()}


def _is_identity(m):
    return all(k == v for k, v in m.items())


class _Inclusion:
    def __init__(self, sub, over, lhs, rhs, derived):
        self.sub = sub
        self.over = over
        self.lhs = lhs
        self.rhs = rhs
        self.derived = derived

    def key(self):
        return (self.sub, self.over, frozenset(self.lhs.items()))


def _translate(inc, rules):
    """Bindings of the client (ids) -> maps between libgt objects."""
    sub, over = rules[inc['sub']], rules[inc['over']]

    def maps(side, which):
        client = inc[which]
        s, o = sub[side], over[side]
        m = {}
        for k, v in (client.get('nodeMap') or {}).items():
            m[s.nodeMap[int(k)]] = o.nodeMap[int(v)]
        for k, v in (client.get('edgeMap') or {}).items():
            (sf, sb), (of, ob) = s.edgeMap[int(k)], o.edgeMap[int(v)]
            # the edges are undirected: keep the orientation the nodes were bound with
            if (m[sf[0]], m[sf[1]]) == (of[0], of[1]):
                m[sf] = of
                if sb is not None:
                    m[sb] = ob
            else:
                m[sf] = ob
                if sb is not None:
                    m[sb] = of
        return m

    return _Inclusion(inc['sub'], inc['over'], maps('lhs', 'lgraphI'), maps('rhs', 'rgraphI'), False)


def close_inclusions(given):
    """The given inclusions and all their composites.

    Raises TransformError when two derivations of the same lhs binding give
    different rhs bindings: the system is then not a functor.
    """
    known = {}
    work = []
    conflicts = []

    def add(inc):
        if inc.sub == inc.over and _is_identity(inc.lhs):
            # the identity is implicit, but it must be sent to the identity
            if not _is_identity(inc.rhs):
                conflicts.append((inc, None))
            return
        k = inc.key()
        old = known.get(k)
        if old is None:
            if len(known) >= MAX_INCLUSIONS:
                raise TransformError('The system generates more than %d inclusions.' % MAX_INCLUSIONS)
            known[k] = inc
            work.append(inc)
        elif old.rhs != inc.rhs:
            conflicts.append((inc, old))

    for inc in given:
        add(inc)
    while work:
        a = work.pop()
        for b in list(known.values()):
            if a.over == b.sub:
                add(_Inclusion(a.sub, b.over, _compose(a.lhs, b.lhs), _compose(a.rhs, b.rhs), True))
            if b.over == a.sub:
                add(_Inclusion(b.sub, a.over, _compose(b.lhs, a.lhs), _compose(b.rhs, a.rhs), True))
    if conflicts:
        details = []
        for inc, old in conflicts:
            if old is None:
                what = 'an automorphism of rule %s whose lhs is the identity is not sent to the identity' % inc.sub
            elif inc.derived or old.derived:
                what = ('the inclusion from rule %s to rule %s obtained by composing inclusions '
                        'disagrees with another one on the rhs' % (inc.sub, inc.over))
            else:
                what = 'two inclusions from rule %s to rule %s have the same lhs but different rhs' % (inc.sub, inc.over)
            details.append({'sub': inc.sub, 'over': inc.over, 'message': what})
        raise TransformError('The inclusions of the system are not compatible with composition.', details)
    return list(known.values())


def _graph_json(g):
    """The result as an undirected graph: a pair of opposite edges is one edge."""
    counts = {}
    for (i, j, _k) in g.g.edges(keys=True):
        counts[(i, j)] = counts.get((i, j), 0) + 1
    edges = []
    for (i, j), n in counts.items():
        if i == j:
            edges += [{'src': int(i), 'dst': int(j)}] * n
        elif i < j:
            edges += [{'src': int(i), 'dst': int(j)}] * max(n, counts.get((j, i), 0))
        elif (j, i) not in counts:
            edges += [{'src': int(j), 'dst': int(i)}] * n
    return {'nodes': [int(n) for n in g.nodes], 'edges': edges}


def run_transform(payload):
    steps = max(1, min(int(payload.get('steps', 1)), MAX_STEPS))

    graph = payload.get('graph') or {}
    if not graph.get('nodes'):
        raise TransformError('Draw a graph first.')
    x = JSON_encoder(graph).g

    rules = {}
    maker = FlatPFunctor.Maker(Graph, Graph)
    pf_rules = {}
    for rid, rule in (payload.get('rules') or {}).items():
        rules[rid] = {'lhs': JSON_encoder(rule['lhs']), 'rhs': JSON_encoder(rule['rhs'])}
        pf_rules[rid] = maker.add_rule(rules[rid]['lhs'].g, rules[rid]['rhs'].g)
    if not rules:
        raise TransformError('The system has no rule.')

    try:
        given = [_translate(i, rules) for i in payload.get('inclusions') or []]
    except (KeyError, TypeError) as e:
        raise TransformError('An inclusion is incomplete (unbound element %s).' % e)
    try:
        closed = close_inclusions(given)
    except KeyError as e:
        raise TransformError('An inclusion is incomplete (unbound element %s).' % e)
    for inc in closed:
        sub, over = rules[inc.sub], rules[inc.over]
        maker.add_inclusion(
            pf_rules[inc.sub], pf_rules[inc.over],
            GraphM(sub['lhs'].g, over['lhs'].g, dict(inc.lhs)),
            GraphM(sub['rhs'].g, over['rhs'].g, dict(inc.rhs)))

    transformation = GT(maker.get())
    result = []
    for _ in range(steps):
        x = transformation.extend(x)
        if x is None:
            raise TransformError('No rule of the system applies to this graph.')
        if len(x.nodes) > MAX_NODES:
            raise TransformError('The graph has more than %d nodes, stopping.' % MAX_NODES)
        result.append(_graph_json(x))
    return {'steps': result}
