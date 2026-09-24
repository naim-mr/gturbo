# GT WebEditor

A web editor to **define a graph rewriting system and apply it to a whole graph at
once**, based on the framework of *global transformations*.

In a global transformation, a system of local rules (a left-hand side rewritten
into a right-hand side) is extended to a synchronous rewriting of an entire
structure. What makes the extension well defined is how the rules relate to each
other: a rule can be included in another one, and the rewriting of the bigger
pattern has to be compatible with the rewriting of the smaller ones. Defining
these inclusions correctly by hand is the tedious and error-prone part of the
method; this editor is meant to make it manageable. The theory is presented in

> Alexandre Fernandez, Luidnel Maignan, Antoine Spicher.
> "Lindenmayer systems and global transformations."
> *International Conference on Unconventional Computation and Natural Computation
> (UCNC 2019)*, pp. 65-78, Springer, 2019.

and the computation is done by [gran_turismo](gran_turismo-master (https://github.com/Alexandre-Fernandez-dev/Global-Transformations)) (`libgt`), the
Python implementation of the framework by Alexandre Fernandez (see the
[references](gran_turismo-master/README.md#references) of its README, which also
covers the follow-up papers on Kan extensions, accretive computation and
non-determinism).

## What the editor does

- **Rewriting systems.** You keep several named systems; each one is made of
  rewriting rules (graphs, drawn in a window) shown as nodes of a *global view*,
  where an arrow is an inclusion of a rule into another.
- **Inclusions computed for you.** When a rule is edited, gran_turismo computes the
  inclusions it forces on the lhs. Only a *base* is shown: the other inclusions
  are obtained by composing the ones you see with automorphisms.
- **Validation.** You bind the rhs of each inclusion (and choose what each
  automorphism becomes in the rhs) by matching elements with colours, then
  validate it. Trivial cases are validated automatically. A system whose
  inclusions are all validated is *fully defined*.
- **Playground.** For a fully defined system, draw a graph and apply the system
  to it: the server closes the inclusions under composition, checks that they are
  compatible, and runs the global transformation with gran_turismo, step by step.

## Context

Developed during a bachelor research internship, as a graphical front end for
gran_turismo.

```
client/              Vue 3 + Quasar + Cytoscape front end   (http://localhost:8080)
server/app/          Flask back end, calls libgt            (http://127.0.0.1:5000)
gran_turismo-master/ the libgt library
```

## Prerequisites

- Python 3.9 or later (developed with 3.10)
- Node.js and npm (developed with Node 24)
- `gran_turismo-master/` at the root of the repository

## 1. Server

From the repository root:

```bash
python3 -m venv .venv
source .venv/bin/activate            # run this in every new terminal
pip install -r server/requirements.txt
export PYTHONPATH="$PWD/gran_turismo-master/src"   # makes `libgt` importable

cd server
flask --app app run --port 5000
```

Check it answers: `curl http://127.0.0.1:5000/` prints `Index`.

`PYTHONPATH` has to be set in each terminal that starts the server. To avoid it,
install the library into the virtual environment instead:
`pip install -e gran_turismo-master`.

## 2. Client

In another terminal:

```bash
cd client
npm install --legacy-peer-deps       # once
NODE_OPTIONS=--openssl-legacy-provider npm run serve
```

Then open <http://localhost:8080/>.

The flag is needed because the project builds with webpack 4, which fails on
Node 17 and later without it (`ERR_OSSL_EVP_UNSUPPORTED`).

The client calls the server at `http://127.0.0.1:5000`. To use another address:

```bash
VUE_APP_SERVER_URL=http://host:port NODE_OPTIONS=--openssl-legacy-provider npm run serve
```

## Using the editor

- **Global view**: `Ctrl` + click on the background creates a rule. Hover a rule
  and drag the handle that appears above it onto another rule (or the same one) to draw an
  inclusion. `Delete` removes the selected elements. Double-click a rule or an
  inclusion to edit it.
- **Rule editor**: `Ctrl` + click creates a node in the lhs or the rhs, the
  handle draws edges. Going back recomputes the inclusions of the rule.
- **Inclusion editor**: bottom windows are the source, top windows the target.
  Click an element of the source, then an element of the target, to bind them
  (same colour). The lhs bindings come from the server; bind the rhs by hand,
  then press **Validate**. Validated inclusions are drawn solid green, pending
  ones dashed ochre.
- **Auto-inclusion** (an edge from a rule to itself): pick the rhs automorphism
  the lhs automorphism is sent to, then press **Validate**.
- The **global view is directed** (an arrow is an inclusion from a rule to another);
  the **graphs of the rules are undirected** (no arrowheads). For libgt, which only
  knows directed graphs, the server encodes each undirected edge as two opposite
  edges, so matching and automorphisms ignore how an edge was drawn.
- Nodes are numbered in breadth-first order of their graph, from the smallest id of
  each connected component.
- **Rewriting Systems** tab: create, rename, open and delete several systems,
  save one as a `.txt` file, or load a `.txt` file under a name of your choice.
  The systems and the current edit are kept in the browser and restored when the
  page is reloaded.
- Each system shows **fully defined** (green: every inclusion is validated) or
  **partially defined** (yellow). A fully defined system has a **Playground**
  button: draw a graph, choose a number of steps and press **Run** to apply the
  system to it with gran_turismo (`POST /transform`). The result appears next to
  the drawing, with a slider to browse the steps and **Use as input** to transform
  it again. The drawing is kept with the system. The server derives the
  composites of the inclusions itself and refuses systems whose composites
  disagree (the message names the inclusions).
- **Rules Set** tab: lists the rules of the open system; the name given to a rule
  is shown on the global view.

## Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| `/Inclusion` answers 500, no inclusion is created | Wrong networkx: `pip install "networkx==3.1"` and restart Flask |
| `ModuleNotFoundError: libgt` | `PYTHONPATH` not set, or `pip install -e gran_turismo-master` not done |
| `ERR_OSSL_EVP_UNSUPPORTED` when building the client | Missing `NODE_OPTIONS=--openssl-legacy-provider` |
| Port 8080 or 5000 already used | Stop the old process, e.g. `pkill -f vue-cli-service` |
| Inclusions are not created, console shows `Inclusion server unreachable` | The Flask server is not running, or `VUE_APP_SERVER_URL` is wrong |

## Reference

Fernandez A., Maignan L., Spicher A. "Lindenmayer systems and global
transformations." UCNC 2019, pp. 65-78. Springer, Cham, 2019.
