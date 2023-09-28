import { defineStore } from 'pinia';
import { ref } from 'vue'
import axios from 'axios'

import { LocalStorage } from 'quasar'
const token = LocalStorage.getItem('token')
const config = {
  headers: {
    Authorization: `Bearer ${token}`
  }
}
export const useCheckStore = defineStore('check', () => {
  const history = ref({})
  const info = ref({})


  const update = () => {
    axios.post('http://8.130.48.157:8081/api/check?type=new', null, config)
      .then(res => {
        if(res.data.message!==null){
          const key = Object.keys(res.data.message)[0];
          if (!history.value[key]) {
            history.value[key] = [];
          }
          history.value[key] = [...history.value[key], ...res.data.message[key]];
          LocalStorage.set('history', history.value)
        }
      })
  }
  setInterval(update, 500)

  return { history,info }
  // state: () => ({
  //   history:{}
  // }),

  // getters: {

  // },

  // actions: {

  // }
});
