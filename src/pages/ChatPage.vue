<template>
  <q-page class="column">
    <div v-if="history&&info" id="content" style="flex:1;background: url(/bg.png);background-size: cover;"
         class="q-pa-md q-mb-xl">
      <q-chat-message v-for="(item, i) in store.history[route.params.id]" :key="i"
                      :avatar="`/avatar/${item.sender == route.params.id?info[item.sender].avatar:myAvatar}.jpeg`"
                      :text="[item.content]" :stamp="item.time"
                      :sent="item.sender != route.params.id"/>
    </div>
    <div class="row fixed bg-white window-width" style="bottom:0">
      <q-input borderless v-model="message" placeholder="Message" style="flex:1" class="q-px-md"></q-input>
      <q-btn @click="sendMessage()" flat :disable="!message.length">
        <q-icon color="primary" name="send"></q-icon>
      </q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import axios from 'axios';
import {useRoute} from 'vue-router'

const myAvatar = localStorage.getItem('avatar');
const history = ref();
const route = useRoute();
const message = ref('');
const info = ref();
const token = localStorage.getItem('token')
const config = {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application-json'
  }
}
import { useCheckStore } from 'stores/check';
const store = useCheckStore();
// const update = () => {
//   axios.post('http://127.0.0.1:8081/api/check', {
//       person: route.params.id
//     }, config
//   ).then((res) => {
//     history.value = res.data
//   })
// }
onMounted(() => {
  // setInterval(update, 500);
  axios.post('http://127.0.0.1:8081/api/info', {
      person: route.params.id
    }, config
  ).then((res) => {
    info.value = res.data
  });
  setTimeout(()=>{
    window.scrollTo(0, document.body.scrollHeight)
  },1000);
})

const sendMessage = async () => {
  try {
    await axios.post('http://127.0.0.1:8081/api/chat', {
        content: message.value,
        receiver: route.params.id
      }, config
    );
    message.value = '';
    setTimeout(()=>{
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    },900);
  } catch (error) {
    console.log(error)
  }
}


</script>
