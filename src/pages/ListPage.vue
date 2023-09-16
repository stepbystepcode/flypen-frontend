<template>
  <q-page class="column">
    <div class="row">
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios';
const sendMessage = async() => {
  const token = localStorage.getItem('token')

  try {
    await axios.post('http://192.168.31.222:8081/api/chat', {
      //receiver: receiver.value
    },{
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
