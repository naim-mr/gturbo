const { ObservableSeq } = require('./ObservableSeq')

class Observable {
  static seq = new ObservableSeq();
  constructor () {
    this.observers = []
  }

  register (obs) {
    this.observers.push(obs)
  }

  notify (op, ...args) {
    this.observers.forEach(
      (obs) => {
        Observable.seq.pushCallBack({ obs: obs, op: op, args: args })
      })
    this.observers.forEach((obs) => Observable.seq.notify())
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
