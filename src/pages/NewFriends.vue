<template>
  <q-page class="column" v-if="list">
    <div class="row window-width"><q-input v-model="search" style="flex:1" class="q-px-md"></q-input><q-btn @click="request('add')">Request</q-btn></div>
    <div class="row person items-center" v-for="(person, i) in list" :key="i">
      <div class="column">
      <div class="row items-center justify-between" style="width: 100vw;">
        <q-avatar class="q-ma-md"><img
          :src="`/avatar/${person.avatar}.jpeg`" alt=""></q-avatar>
        <span style="font-size: 1.2em;">{{ person.username }}</span>
        <div class="q-gutter-x-md q-pr-lg">
        <q-btn round><q-icon name="check" @click="handle(`${person.username}`,'allow')"></q-icon></q-btn>
        <q-btn round><q-icon name="close" @click="handle(`${person.username}`,'reject')"></q-icon></q-btn>
        </div>
      </div>
      <q-separator/>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import axios from 'axios';

const list = ref();
const search = ref('');
const token = localStorage.getItem('token')
const username = localStorage.getItem('username')
const request=(atti:string)=>{
  axios.post(`http://192.168.184.81:8081/api/newfriends?username=${search.value}&operation=${atti}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }
  ).then(res => {
    console.log(res)
  })

}
const handle=(req:string,atti:string)=>{
  axios.post(`http://192.168.184.81:8081/api/nfmgr?info=${atti}&username=${req}`, {},{
    headers:{
      'Authorization': `Bearer ${token}`,
    }
  }).then(res => {
    console.log(res)
  })

}
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
    if (username){list.value = res.data[username].req;
      localStorage.setItem('avatar', res.data[username].avatar);}
  })

} catch (error) {
  console.log(error)
}
</script>

<style scoped lang="scss">

</style>
