<template>
  <q-page class="column" v-if="list">
    <div class="row person items-center" v-for="(person, i) in list" :key="i">
      <div @click="router.push(`/chat/person/${person.username}`)" style="width: 100vw;">
        <q-avatar class="q-ma-md"><img
          :src="`/avatar/${person.avatar}.jpeg`" alt=""></q-avatar>
        <span style="font-size: 1.2em;">{{ person.username }}</span>
        <q-separator/>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router';
import axios from 'axios';

const router = useRouter();
const list = ref();
const token = localStorage.getItem('token')
const username = localStorage.getItem('username')
try {

  axios.post('http://192.168.184.81:8081/api/info', {
      person: ''
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application-json'
      }
    }
  ).then(res => {
    if (username){
      list.value = res.data[username].friends;
      localStorage.setItem('avatar', res.data[username].avatar);
    }
  })

} catch (error) {
  console.log(error)
}
</script>
