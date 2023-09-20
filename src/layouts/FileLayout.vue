<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
           Flypen Wiki
        </q-toolbar-title>

        <div>C++ Course Design</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      bordered
      v-model="leftDrawerOpen"
    >
      <div class="bg-primary column">
        <div class="q-pa-lg">
          <q-avatar @click="router.push('/avatar')" v-if="username && avatar" size="60px"><img :src="`/avatar/${avatar}.jpeg`" alt=""></q-avatar>
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
        <q-item clickable v-ripple>
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
      <router-view/>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import {useRoute} from 'vue-router'
const route = useRoute();
import {ref} from 'vue';
import {useRouter} from 'vue-router';
const router=useRouter();

const leftDrawerOpen = ref(false);
const avatar = ref();
setTimeout(() => {
  avatar.value = localStorage.getItem('avatar')
}, 500);
const username = ref(localStorage.getItem('username')||' ');

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('avatar');
  router.push('/login')
}

</script>

<style scoped lang="scss">

</style>
