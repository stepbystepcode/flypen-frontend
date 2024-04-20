import { defineStore } from 'pinia';
import { ref } from 'vue'
import { api } from 'boot/axios';
import { LocalStorage, Screen } from 'quasar'
import { decode } from 'src/utils/crypto-core';
import _sodium from 'libsodium-wrappers';
await _sodium.ready;
const sodium = _sodium;
export const useCheckStore = defineStore('check', () => {
  const isMobile = ref((window.location.href.includes('login') || window.location.href.includes('signup') || window.location.href.includes('avatar') || window.location.href.includes('file')) ? true : Screen.width < 450)
  const history = ref({})
  const info = ref({})
  const order = ref({})
  const avatarList = ['O1kmMD', 'O1ky0I', 'O1kvZ1', 'O1kZBG', 'O1k1Hv', 'O1kn1Y', 'O1kiMU', 'O1kF0p', 'O1kzKj', 'O1kMKK', 'O1bw5s', 'O1b3fB', 'O1bIpg', 'O1bukl', 'O1b88b', 'O1b6DP', 'O1b2n6', 'O1b9wF', 'O1blSD', 'O1bfAI', 'O1bY51', 'O1bsYG', 'O1bdpM', 'O1bckr', 'O1bS6c', 'O1bQDq', 'O1bGnv', 'O1bLCY', 'O1bHSU', 'O1bDAp', 'O1b4qj', 'O1bRYx']
  const unread = ref({});
  const avatar = (n: number) => {
    if (n === 100) return 'https://ooo.0x0.ooo/2023/10/12/O19USD.png';
    const str = avatarList[n];
    return `https://ooo.0x0.ooo/2023/10/03/${str}.webp`
  }
  const update = () => {
    if (window.location.pathname !== '/login' && window.location.pathname !== '/signup')
      api.post('/api/check?type=new', '', {

        headers: {
          Authorization: `Bearer ${LocalStorage.getItem('token')}`
        }
      }
      )
        .then(res => {
          if (res.data.message !== null) {
           

            const key = Object.keys(res.data.message)[0];
            decode(res.data.message[key][0].content, res.data.message[key][0].sender);
            if (!history.value[key]) history.value[key] = [];
            history.value[key] = [...history.value[key], ...res.data.message[key]];
            if (!unread.value[key])
              unread.value[key] = 0;
            if (res.data.message[key][0].sender !== info.value.username)
              unread.value[key] += res.data.message[key].length;
            LocalStorage.set('history', history.value)
            if (!order.value) order.value = {};
            if (!(key in order.value)) order.value[key] = [];
            order.value[key] = res.data.message[key][0].time
            LocalStorage.set('order', order.value)
          }
        });
  }
  setInterval(update, 500)

  return { history, info, order, avatar, isMobile, unread }
  // state: () => ({
  //   history:{}
  // }),

  // getters: {

  // },

  // actions: {

  // }
});
