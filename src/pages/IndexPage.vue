<template>
  <q-page class="column">
    <div style="flex:1" class="bg-cyan"></div>
    <div class="row">
      <q-input v-model="message" placeholder="Message" style="flex:1" class="q-px-md"></q-input>
      <q-btn @click="sendMessage()" flat><q-icon color="primary" name="send"></q-icon></q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
const message = ref('');
const receiver = ref('');
const sendMessage = async () => {
  const token = localStorage.getItem('token')

  try {
    await axios.post('http://192.168.184.81:8081/api/info', {
      content: message.value,
      receiver: receiver.value
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application-json'
      }
    }
    )

  } catch (error) {
    console.log(error)
  }
}
//'Authorization', 'Bearer '+localStorage.getItem('token')
</script>
