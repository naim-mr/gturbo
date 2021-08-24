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
      logged:false,
      username:''
      
    }
  },
  mutations: {

  },

})
