class Observer {
  constructor (o) {
    o.register(this)
  }
}

module.exports = Observer
