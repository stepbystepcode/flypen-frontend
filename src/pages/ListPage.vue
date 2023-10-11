<template>
  <q-page class="column" v-if="list">
    <div class="person items-center relative-position" v-for="(person, i) in list" :key="i" v-ripple.early>
      <div class="row items-center" @click="store.unread[person.username]=0;router.push(`/chat/person/${person.username}`)"
           v-touch-hold.mouse="handleHold"
           :style="`width: 100vw;background-color:${selected===person.username?'gainsboro':'none'};`">
        <q-avatar class="q-ma-md"><img :src="store.avatar(person.avatar)" alt=""></q-avatar>
        <div class="column" style="flex:1">
          <div class="row justify-between" style="flex:1"><span style="font-size: 1.2em;"
                                                                class="q-mb-sm">{{ person.username }}</span><span
            class="text-grey q-mr-md"
            v-if="store.history[person.username]">{{ time(store.history[person.username].at(-1).time) }}</span></div>
          <div class="row justify-between">
          <span v-if="store.history[person.username]"
                style="color:#808080;width: 60vw" class="ellipsis">{{ store.history[person.username].at(-1).content }}</span>
            <div style="background: red;border-radius: 100px" class="q-px-sm text-white q-mr-md" v-if="store.unread[person.username]">{{store.unread[person.username]}}</div>
          </div>
        </div>
      </div>
      <q-separator/>
    </div>
  </q-page>
  <div v-else>You do not have any friends...</div>
</template>

<script setup>
import {ref} from 'vue'
import {useRouter} from 'vue-router';
import {useCheckStore} from 'stores/check';
import axios from "axios";

import {useQuasar} from 'quasar';
const $q = useQuasar()
const store = useCheckStore();
const selected = ref('');
const handleHold = ({evt}) => {
  if (selected.value === '')
    selected.value = evt.target.innerText;
  else
    selected.value = '';
}
const time = (time) => {
  const inputDate = new Date(time);
  const today = new Date();
  if (inputDate.getFullYear() === today.getFullYear() && inputDate.getMonth() === today.getMonth() && inputDate.getDate() === today.getDate())
    return time.slice(11, 16)
  else if (inputDate.getFullYear() === today.getFullYear())
    return time.slice(5, 16)
  else
    return time

}
const router = useRouter();
const list = ref();
const token = $q.localStorage.getItem('token');
axios.post('http://8.130.48.157:8081/api/info', '', {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application-json'
    }
  }
).then((res) => {
  store.info.friends = res.data.message[store.info.username].friends;
  list.value = store.info.friends.sort((a, b) => {
    const timeA = store.order?.[a.username];
    const timeB = store.order?.[b.username];
    if (!timeA) return 1
    if (!timeB) return -1
    return new Date(timeB) - new Date(timeA)
  });
})
</script>
