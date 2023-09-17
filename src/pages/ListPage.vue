<template>
  <q-page class="column">
    <div class="row person items-center" v-for="(person, i) in list" :key="i">
      <div @click="router.push(`/chat/person/${person}`)" style="width: 100vw;"><q-avatar class="q-ma-md"> <img
            :src="`https://api.ayao.ltd/head-portrait/api.php?a=${Math.ceil(Math.random()*10)}`"></q-avatar>
        <span style="font-size: 1.2em;">{{ person }}</span><q-separator />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {useRouter} from 'vue-router';
import axios from 'axios';
const router=useRouter();
const list = 'lglglglgy,zzc20001'.split(',');
const sendMessage = async () => {
  const token = localStorage.getItem('token')
  try {
    await axios.post('http://127.0.0.1:8081/api/list', {
      //receiver: receiver.value
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
