# GT WebEditor

A web editor for graph rewriting systems. Each node of the *global view* is a
rewriting rule (a left-hand side and a right-hand side); each edge is an
inclusion between two rules. The inclusions forced by a rule are computed by
[gran_turismo](gran_turismo-master) (`libgt`) on the server.

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
