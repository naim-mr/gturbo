const memoize = require('lodash.memoize')
const sqrt2 = Math.sqrt(2)

function canStartOn (node) {
  const { options, previewEles, ghostEles, handleNode } = this
  const isPreview = el => previewEles.anySame(el)
  const isGhost = el => ghostEles.anySame(el)
  const userFilter = el => el.filter(options.handleNodes).length > 0
  const isHandle = el => handleNode.same(el)
  const isTemp = el => isPreview(el) || isHandle(el) || isGhost(el)

  const { enabled, active, grabbingNode } = this

  return (
    enabled && !active && !grabbingNode &&
    (node == null || (!isTemp(node) && userFilter(node)))
  )
}

function canStartDrawModeOn (node) {
  return this.canStartOn(node) && this.drawMode
}

function canStartNonDrawModeOn (node) {
  return this.canStartOn(node) && !this.drawMode
}

function show (node) {
  const { options, drawMode } = this

  if (!this.canStartOn(node) || (drawMode && !options.handleInDrawMode)) { return }

  this.sourceNode = node

  this.setHandleFor(node)

  this.emit('show', this.hp(), this.sourceNode)

  return this
}

function hide () {
  this.removeHandle()

  this.emit('hide', this.hp(), this.sourceNode)

  return this
}

function start (node) {
  if (!this.canStartOn(node)) { return }

  this.active = true

  this.sourceNode = node
  this.sourceNode.addClass('eh-source')

  this.disableGestures()
  this.disableEdgeEvents()

  this.emit('start', this.hp(), node)
}

function update (pos) {
  if (!this.active) { return }

  const p = pos

  this.mx = p.x
  this.my = p.y

  this.updateEdge()
  this.throttledSnap()

  return this
}

function snap () {
  if (!this.active || !this.options.snap) { return false }

  const cy = this.cy
  const tgt = this.targetNode
  const threshold = this.options.snapThreshold
  const mousePos = this.mp()
  const { handleNode, previewEles, ghostNode } = this

  const radius = n => sqrt2 * Math.max(n.outerWidth(), n.outerHeight()) / 2 // worst-case enclosure of bb by circle
  const sqDist = (x1, y1, x2, y2) => { const dx = x2 - x1; const dy = y2 - y1; return dx * dx + dy * dy }
  const sqDistByPt = (p1, p2) => sqDist(p1.x, p1.y, p2.x, p2.y)
  const nodeSqDist = n => sqDistByPt(n.position(), mousePos)

  const sqThreshold = n => { const r = radius(n); const t = r + threshold; return t * t }
  const isWithinThreshold = n => nodeSqDist(n) <= sqThreshold(n)

  const bbSqDist = n => {
    const p = n.position()
    const halfW = n.outerWidth() / 2
    const halfH = n.outerHeight() / 2

    // node and mouse positions, line is formed from node to mouse
    const nx = p.x
    const ny = p.y
    const mx = mousePos.x
    const my = mousePos.y

    // bounding box
    const x1 = nx - halfW
    const x2 = nx + halfW
    const y1 = ny - halfH
    const y2 = ny + halfH

    const insideXBounds = x1 <= mx && mx <= x2
    const insideYBounds = y1 <= my && my <= y2

    if (insideXBounds && insideYBounds) { // inside box
      return 0
    } else if (insideXBounds) { // perpendicular distance to box, top or bottom
      const dy1 = my - y1
      const dy2 = my - y2

      return Math.min(dy1 * dy1, dy2 * dy2)
    } else if (insideYBounds) { // perpendicular distance to box, left or right
      const dx1 = mx - x1
      const dx2 = mx - x2

      return Math.min(dx1 * dx1, dx2 * dx2)
    } else if (mx < x1 && my < y1) { // top-left corner distance
      return sqDist(mx, my, x1, y1)
    } else if (mx > x2 && my < y1) { // top-right corner distance
      return sqDist(mx, my, x2, y1)
    } else if (mx < x1 && my > y2) { // bottom-left corner distance
      return sqDist(mx, my, x1, y2)
    } else { // bottom-right corner distance
      return sqDist(mx, my, x2, y2)
    }
  }

  const cmpBbSqDist = (n1, n2) => bbSqDist(n1) - bbSqDist(n2)

  const cmp = cmpBbSqDist

  const allowHoverDelay = false

  const mouseIsInside = n => {
    const mp = mousePos
    const w = n.outerWidth()
    const halfW = w / 2
    const h = n.outerHeight()
    const halfH = h / 2
    const p = n.position()
    const x1 = p.x - halfW
    const x2 = p.x + halfW
    const y1 = p.y - halfH
    const y2 = p.y + halfH

    return (
      x1 <= mp.x && mp.x <= x2 &&
      y1 <= mp.y && mp.y <= y2
    )
  }

  const isEhEle = n => n.same(handleNode) || n.same(previewEles) || n.same(ghostNode)

  const nodesByDist = cy.nodes(n => !isEhEle(n) && isWithinThreshold(n)).sort(cmp)
  let snapped = false

  if (tgt.nonempty() && !isWithinThreshold(tgt)) {
    this.unpreview(tgt)
  }

  for (let i = 0; i < nodesByDist.length; i++) {
    const n = nodesByDist[i]

    // skip a parent node when the mouse is inside it
    if (n.isParent() && mouseIsInside(n)) { continue }

    // skip a child node when the mouse is not inside the parent
    if (n.isChild() && !mouseIsInside(n.parent())) { continue }

    if (n.same(tgt) || this.preview(n, allowHoverDelay)) {
      snapped = true
      break
    }
  }

  return snapped
}

function preview (target, allowHoverDelay = true) {
  const { options, sourceNode, ghostNode, ghostEles, presumptiveTargets, previewEles, active } = this
  const source = sourceNode
  const isLoop = target.same(source)
  const loopAllowed = options.loopAllowed(target)
  const isGhost = target.same(ghostNode)
  const noEdge = !options.edgeType(source, target)
  const isHandle = target.same(this.handleNode)
  const isExistingTgt = target.same(this.targetNode)

  if (
    !active || isHandle || isGhost || noEdge || isExistingTgt ||
    (isLoop && !loopAllowed)
    // || (target.isParent())
  ) {
    return false
  }

  if (this.targetNode.nonempty()) {
    this.unpreview(this.targetNode)
  }

  clearTimeout(this.previewTimeout)

  const applyPreview = () => {
    this.targetNode = target

    presumptiveTargets.merge(target)

    target.addClass('eh-presumptive-target')
    target.addClass('eh-target')

    this.emit('hoverover', this.mp(), source, target)

    if (options.preview) {
      target.addClass('eh-preview')

      ghostEles.addClass('eh-preview-active')
      sourceNode.addClass('eh-preview-active')
      target.addClass('eh-preview-active')

      this.makePreview()

      this.emit('previewon', this.mp(), source, target, previewEles)
    }
  }

  if (allowHoverDelay && options.hoverDelay > 0) {
    this.previewTimeout = setTimeout(applyPreview, options.hoverDelay)
  } else {
    applyPreview()
  }

  return true
}

function unpreview (target) {
  if (!this.active || target.same(this.handleNode)) { return }

  const { previewTimeout, sourceNode, previewEles, ghostEles, cy } = this
  clearTimeout(previewTimeout)
  this.previewTimeout = null

  const source = sourceNode

  target.removeClass('eh-preview eh-target eh-presumptive-target eh-preview-active')
  ghostEles.removeClass('eh-preview-active')
  sourceNode.removeClass('eh-preview-active')

  this.targetNode = cy.collection()

  this.removePreview(source, target)

  this.emit('hoverout', this.mp(), source, target)
  this.emit('previewoff', this.mp(), source, target, previewEles)

  return this
}

function stop () {
  if (!this.active) { return }

  const { sourceNode, targetNode, ghostEles, presumptiveTargets } = this

  clearTimeout(this.previewTimeout)

  sourceNode.removeClass('eh-source eh-preview-active')
  targetNode.removeClass('eh-target eh-preview eh-hover eh-preview-active')
  presumptiveTargets.removeClass('eh-presumptive-target')

  this.makeEdges()

  this.removeHandle()

  ghostEles.remove()

  this.clearCollections()

  this.resetGestures()
  this.enableEdgeEvents()

  this.active = false

  this.emit('stop', this.mp(), sourceNode)

  return this
}

module.exports = {
  show,
  hide,
  start,
  update,
  preview,
  unpreview,
  stop,
  snap,
  canStartOn,
  canStartDrawModeOn,
  canStartNonDrawModeOn
}
