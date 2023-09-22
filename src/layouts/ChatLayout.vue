<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn v-if="!route.params.id" flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-btn v-else flat dense round icon="arrow_back" aria-label="Menu" @click="router.push('/chat')" />

        <q-toolbar-title class="q-py-sm">
          <div v-if="route.params.id">
         <q-avatar v-if="store.info.value"><img :src="`/avatar/${store.info.value.avatar}.jpeg`" alt=""></q-avatar>
         {{ route.params.id }} 
          </div>
          <div v-else>
          Flypen Chat</div>
        </q-toolbar-title>

        <div>C++ Course Design</div>
      </q-toolbar>
    </q-header>
    <q-dialog v-model="pickerShow">
      <q-card style="width: 80vw">
    <q-color v-model="hexa" />
    <div class="row justify-end q-gutter-md q-mt-sm"><q-btn @click="pickerShow=false"> Cancel </q-btn>
    <q-btn @click="
    setColor">Confirm</q-btn>
    </div>
</q-card>
</q-dialog>

    <q-drawer show-if-above bordered v-model="leftDrawerOpen">
      <div class="bg-primary column">
        <div class="q-pa-lg">
          <q-avatar @click="router.push('/avatar')" v-if="username && avatar" size="60px"><img
              :src="`/avatar/${avatar}.jpeg`" alt=""></q-avatar>
        </div>
        <div class="q-px-lg text-white text-h6 q-pb-md">{{ username }}</div>
      </div>
      <div class="column">
        <q-item clickable v-ripple>
          <q-item-section avatar>
            <q-icon name="account_circle" color="primary"></q-icon>
          </q-item-section>
          <q-item-section>Profile</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="router.push('/chat/newfriends')">
          <q-item-section avatar>
            <q-icon name="group" color="primary"></q-icon>
          </q-item-section>
          <q-item-section>New Friends</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="router.push('/chat')">
          <q-item-section avatar>
            <q-icon name="contacts" color="primary"></q-icon>
          </q-item-section>
          <q-item-section>Contacts</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="router.push('/file/explorer')">
          <q-item-section avatar>
            <q-icon name="book" color="primary"></q-icon>
          </q-item-section>
          <q-item-section>Group wiki</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="settings">
          <q-item-section avatar>
            <q-icon name="settings" color="primary"></q-icon>
          </q-item-section>
          <q-item-section>Settings</q-item-section>
        </q-item>
        <q-item clickable v-ripple @click="logout()">
          <q-item-section avatar>
            <q-icon name="logout" color="primary"></q-icon>
          </q-item-section>
          <q-item-section>Logout</q-item-section>
        </q-item>
      </div>

    </q-drawer>

    <q-page-container>
      <router-view  v-slot="{ Component }">
        <transition  
  enter-active-class="animated fadeInRight"
  >  
    <component :is="Component" />  
  </transition>  
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useCheckStore } from 'stores/check';
const setColor=()=>{
  document.querySelector(':root').style.setProperty('--q-primary', hexa.value);
  pickerShow.value=false;
}
const store = useCheckStore();
import { useRoute } from 'vue-router'
const route = useRoute();
const hexa=ref('')
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Swal from "sweetalert2";
const router = useRouter();

const pickerShow=ref(false);
const settings=()=>{
  toggleLeftDrawer();
  pickerShow.value=true;
}
const leftDrawerOpen = ref(false);
const avatar = ref();
setTimeout(() => {
  avatar.value = localStorage.getItem('avatar')
}, 500);
const username = ref(localStorage.getItem('username') || ' ');

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('avatar');
  router.push('/login')
}
// const token = localStorage.getItem('token')
// const config = {
//   headers: {
//     'Authorization': `Bearer ${token}`
//   }
// }
// const update = () => {
//   axios.post('http://8.130.48.157:8081/api/check', null, config
//   ).then((res) => {
//     history.value = res.data
//   })
// }



</script>

<style scoped lang="scss">
</style>
