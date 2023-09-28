<template>
  <q-page class="column">
    <div class="row window-width">
      <q-input v-model="search" style="flex:1" class="q-px-md"></q-input>
      <q-btn @click="request('add')"><q-icon name="search"></q-icon></q-btn>
    </div>
    <div v-if="list">
    <div class="row person items-center" v-for="(person, i) in list"  :key="i">
      <div class="column">
        <div class="row items-center justify-between" style="width: 100vw;">
          <q-avatar class="q-ma-md"><img
            :src="`/avatar/${person.avatar}.jpeg`" alt=""></q-avatar>
          <span style="font-size: 1.2em;">{{ person.username }}</span>
          <div class="q-gutter-x-md q-pr-lg">
            <q-btn round>
              <q-icon name="check" @click="handle(`${person.username}`,'allow')"></q-icon>
            </q-btn>
            <q-btn round>
              <q-icon name="close" @click="handle(`${person.username}`,'reject')"></q-icon>
            </q-btn>
          </div>
        </div>
        <q-separator/>
      </div>
    </div>
    <div v-show="!list.length">You don't have any new friend requests.</div>
    </div>
  </q-page>
</template>

<script setup>
import {ref} from 'vue'
import axios from 'axios';
import Swal from 'sweetalert2';

const list = ref();
const search = ref('');
const token = localStorage.getItem('token')
const username = localStorage.getItem('username')
const request = (atti) => {
  axios.post(`http://8.130.48.157:8081/api/newfriends?username=${search.value}&operation=${atti}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }
  ).then(res => {
    console.log(res);
    Swal.fire(res.data, '', 'success');
  })

}
const handle = (req, atti) => {
  axios.post(`http://8.130.48.157:8081/api/nfmgr?info=${atti}&username=${req}`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  }).then(res => {
    Swal.fire({
      title: 'Success',
      icon: 'success',
    });
    list.value = list.value.filter((item) => item.username !== req);
    console.log(res)
  })

}
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
    if (username) {
      list.value = res.data[username].req;
      localStorage.setItem('avatar', res.data[username].avatar);
    }
  })

} catch (error) {
  console.log(error)
}
</script>

<style scoped lang="scss">

</style>
