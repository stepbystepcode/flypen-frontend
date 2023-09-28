import { defineStore } from 'pinia';
import { ref } from 'vue'
import axios from 'axios'
import {useQuasar} from 'quasar';
import { LocalStorage } from 'quasar'
const $q = useQuasar()
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
        //history.value = {...history.value,...res.data.message}
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
