import { defineStore } from 'pinia';
import { ref } from 'vue'
import axios from 'axios'
const token = localStorage.getItem('token')
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
}
export const useCheckStore = defineStore('check', () => {
  const history = ref({})

  const update = () => {
    axios.post('http://8.130.48.157:8081/api/check', null, config)
      .then(res => {
        history.value = res.data
      })
  }

  setInterval(update, 500)

  return { history }
  // state: () => ({
  //   history:{}
  // }),

  // getters: {

  // },

  // actions: {

  // }
});
