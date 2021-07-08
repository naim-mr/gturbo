import { createStore } from 'vuex'
const removeElement = (array, elem) => {
  var index = array.indexOf(elem)
  console.log(index)
  if (index > -1) {
    array.splice(index, 1)
  }
  return index
}
export default createStore({
  state () {
    return {
      rulesId: [],
      cptRule: 0,
      curRule: 0,
      index: 0
    }
  },
  mutations: {
    addRule (state) {
      if (state.cptRule == 0)state.rulesId[0] = 0
      state.cptRule++
      state.rulesId.push(state.cptRule)
      state.curRule = state.cptRule
      state.index++
    },
    deleteRule (state) {
      if (removeElement(state.rulesId, state.curRule) > -1) state.index--
    }

  },
  getters: {
    getNext: (state) => {
      if (state.index + 1 < state.rulesId.length) {
        state.index++
        console.log(state.rulesId)
        return state.rulesId[state.index]
      } else throw 'No Next Rule'
    },
    getPrevious: (state) => {
      if (state.index > 0) {
        state.index--
        console.log(state.rulesId)
        return state.rulesId[state.index]
      } else throw 'No Previous Rule '
    }
  },
  actions: {

  },
  modules: {
  }
})
