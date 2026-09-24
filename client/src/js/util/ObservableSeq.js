class ObservableSeq {
  constructor () {
    this.observables = []
    this.callBack = []
  }

  pushCallBack (cb) {
    this.callBack.push(cb)
  }

  notify () {
    const cb = this.callBack.shift()
    if (cb === undefined) return
    // an observer that fails must not leave the queue out of step with the
    // notifications to come: every later event would run the wrong callback
    try {
      cb.obs[cb.op].apply(cb.obs, cb.args)
    } catch (e) {
      console.error('Observer failed on ' + cb.op, e)
    }
  }
}

module.exports = { ObservableSeq }
