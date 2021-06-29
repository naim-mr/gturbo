class Observable {
  constructor () {
    this.observers = []
  }

  register (obs) {
    this.observers.push(obs)
  }

  notify (op, ...args) {
    console.log(op)
    for (const obs of this.observers) {
      obs[op].apply(obs, args)
    }
  }

  unregister (obs) {
    var index = this.observers.indexOf(obs)
    if (index > -1) {
      this.observers.splice(index, 1)
    }
  }

  unregisterAll () {
    this.observer = []
  }
}

module.exports = Observable
