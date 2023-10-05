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
            :src="store.avatar(person.avatar)" alt=""></q-avatar>
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
import {useCheckStore} from 'stores/check';
const store = useCheckStore();
import {ref} from 'vue'
import axios from 'axios';
import Swal from 'sweetalert2';
import {useQuasar} from 'quasar';
const $q = useQuasar()
const list = ref();
const search = ref('');
const token = $q.localStorage.getItem('token')
const username = $q.localStorage.getItem('info').username
const request = (atti) => {
  axios.post(`http://8.130.48.157:8081/api/newfriends?username=${search.value}&operation=${atti}`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    }
  ).then(res => {
    console.log(res);
    Swal.fire(res.data.message, '', res.data.code===200?'success':'error');
  })

}
const handle = (req, atti) => {
  axios.post(`http://8.130.48.157:8081/api/nfmgr?info=${atti}&username=${req}`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`,
    }
  }).then(res => {
    Swal.fire({
      title: res.data.message,
      icon: res.data.code===200?'success':'error',
    });
    list.value = list.value.filter((item) => item.username !== req);
    axios.post('http://8.130.48.157:8081/api/info', '', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application-json'
        }
      }
    ).then((res) => {
      store.info.friends = res.data.message[username].friends;
    })
  })

}

  axios.post('http://8.130.48.157:8081/api/info', '', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application-json'
      }
    }
  ).then((res) => {
      list.value = res.data.message[username].req;
  })

</script>

<style scoped lang="scss">

</style>
