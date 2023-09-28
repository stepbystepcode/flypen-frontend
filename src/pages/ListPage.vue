<template>
  <q-page class="column" v-if="list">
    <div class="person items-center relative-position" v-for="(person, i) in list" :key="i"  v-ripple.early>
      <div @click="router.push(`/chat/person/${person.username}`)" v-touch-hold.mouse="handleHold" :style="`width: 100vw;background-color:${selected==person.username?'gainsboro':'none'};`">
        <q-avatar class="q-ma-md"><img :src="`/avatar/${person.avatar}.jpeg`" alt=""></q-avatar>
        <span style="font-size: 1.2em;">{{ person.username }}</span>
      </div>
        <q-separator />
    </div>
  </q-page>
  <div v-else>You dont have any friends...</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import axios from 'axios';

const selected=ref('');
const handleHold =({ evt, ...newInfo })=> {
  if(selected.value==''){
        selected.value=evt.target.innerText;

      }else{
        selected.value='';
      }
    }
const router = useRouter();
const list = ref();
const token = localStorage.getItem('token')
const username = localStorage.getItem('username')
try {

  axios.post('http://8.130.48.157:8081/api/info', {
    person: ''
  }, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application-json'
    }
  }
  ).then(res => {
    if (username&&res.data[username]!=null) {
      list.value = res.data[username].friends;
      localStorage.setItem('avatar', res.data[username].avatar);
    }
  })

} catch (error) {
  console.log(error)
}
</script>
