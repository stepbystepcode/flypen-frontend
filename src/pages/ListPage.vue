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
import {useCheckStore} from 'stores/check';
import {useQuasar} from 'quasar';
const store = useCheckStore();
const selected=ref('');
const $q = useQuasar()
const handleHold =({ evt, ...newInfo })=> {
  if(selected.value==''){
        selected.value=evt.target.innerText;

      }else{
        selected.value='';
      }
    }
const router = useRouter();
const list = ref();
const token = $q.localStorage.getItem('token')
const username = store.info.username
if (username)
list.value = store.info.friends;

</script>
