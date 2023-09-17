<template>
  <q-page class="column">
    <div v-if="history" style="flex:1;background: url(/bg.png);background-size: cover;" class="q-pa-md">
      <q-chat-message v-for="(item, i) in history[route.params.id]" :key="i"
        avatar="https://cdn.quasar.dev/img/avatar1.jpg" :text="[item.content]" :stamp="item.time"
        :sent="item.sender != route.params.id" />
      <!--      <q-chat-message-->
      <!--        avatar="https://cdn.quasar.dev/img/avatar1.jpg"-->
      <!--        :text="['hey, how are you?']"-->
      <!--        stamp="7 minutes ago"-->
      <!--        sent-->
      <!--      />-->
      <!--      <q-chat-message-->
      <!--        avatar="https://cdn.quasar.dev/img/avatar5.jpg"-->
      <!--        :text="['doing fine, how r you?']"-->
      <!--        stamp="4 minutes ago"-->
      <!--        text-color="white"-->
      <!--        bg-color="primary"-->
      <!--      />-->
    </div>
    <div class="row">
      <q-input borderless v-model="message" placeholder="Message" style="flex:1" class="q-px-md"></q-input>
      <q-btn @click="sendMessage()" flat>
        <q-icon color="primary" name="send"></q-icon>
      </q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios';
import { useRoute } from 'vue-router'
const history = ref();
const route = useRoute();
const message = ref('');
const token = localStorage.getItem('token')
const config = {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application-json'
  }
}

axios.post('http://127.0.0.1:8081/api/check', {
  person: route.params.id
}, config
).then((res) => {
  console.log(res.data)
  history.value = res.data
})
const sendMessage = async () => {
  try {
    await axios.post('http://127.0.0.1:8081/api/chat', {
      content: message.value,
      receiver: route.params.id
    }, config
    )
  } catch (error) {
    console.log(error)
  }
}


</script>
