<template>
  <q-page class="column">
    <div class="tgme_background_wrap">
      <canvas id="tgme_background" class="tgme_background default" width="50" height="50"
        data-colors="9fb0ea,bbead5,b0cdeb,b2e3dd"></canvas>
      <div style="background-image: url('/bg.svg')" class="tgme_background_pattern default"></div>
    </div>
    <!--    <div v-if="store" id="content" style="flex:1;background: url(/bg.svg)"-->
    <!--         class="q-pa-md q-mb-xl">-->
    <div class=" q-pa-md q-mb-xl">
      <q-chat-message v-for="(item, i) in store.history[route.params.id]" :key="i"
        :avatar="`/avatar/${item.sender == route.params.id ? yourAvatar : myAvatar}.jpeg`"
        :bg-color="`${item.sender == route.params.id ? 'white' : 'info'}`" :text="[item.content]" :stamp="item.time"
        :sent="item.sender != route.params.id" />
    </div>
    <div class="row fixed bg-white window-width" style="bottom:0">
      <q-input borderless v-model="message" placeholder="Message" style="flex:1" class="q-px-md"
        @keyup.enter="sendMessage()"></q-input>
      <q-btn @click="sendMessage()" flat :disable="!message.length">
        <q-icon color="primary" name="send"></q-icon>
      </q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import myBg from '../boot/bg.js';
import { onMounted, ref } from 'vue'
import axios from 'axios';
import { useRoute } from 'vue-router'
import { useCheckStore } from 'stores/check';
import Swal from "sweetalert2";
import { useRouter } from "vue-router";
import {useQuasar} from 'quasar';
const router = useRouter();
const store = useCheckStore();
const myAvatar = store.info.avatar
const yourAvatar = ref('');
const route = useRoute();
const message = ref('');
const $q = useQuasar()
const token = $q.localStorage.getItem('token')
const config = {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application-json'
  }
}

// const update = () => {
//   axios.post('http://8.130.48.157:8081/api/check', {
//       person: route.params.id
//     }, config
//   ).then((res) => {
//     history.value = res.data
//   })
// }
onMounted(() => {
  // setInterval(update, 500);
  axios.post('http://8.130.48.157:8081/api/info', {
    person: route.params.id
  }, config
  ).then((res) => {
    const username = store.info.username
    if (!res.data.message[username].friends.find(item => item.username === route.params.id)) {
      Swal.fire({
        title: 'Oops...',
        text: 'You are not friends with this person!',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        router.push('/chat')
      });
    }
    console.log(res.data)
    store.info = {
      ...store.info,
      ...res.data.message[route.params.id],
      friends: store.info.friends
    };
    $q.localStorage.set('info', store.info)
    yourAvatar.value = store.info.avatar;
  });
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight)
  }, 1000);
  myBg.init();
})

const sendMessage = async () => {
  try {
    if (!message.value.length) return;
    await axios.post('http://8.130.48.157:8081/api/chat', {
      content: message.value,
      receiver: route.params.id
    }, config
    );
    message.value = '';
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 900);
  } catch (error) {
    console.log(error)
  }
}


</script>
<style scoped lang="scss">
.tgme_background {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
}

.tgme_background_pattern.default {
  opacity: 0.3;
  background-image: url(/bg.svg);
}
.tgme_background_wrap{
  display: flex;
  position: absolute;
  height: 100%;
  width: 100vw;
}

.tgme_background_pattern {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  mix-blend-mode: overlay;
  background: center repeat;
  background-size: 420px auto;
}
</style>
