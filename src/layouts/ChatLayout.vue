<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn v-if="!route.params.id" flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer"/>
        <q-btn v-else flat dense round icon="arrow_back" aria-label="Menu" @click="router.push('/chat')"/>

        <q-toolbar-title class="q-py-sm">
          <div v-if="route.params.id">
            <q-avatar v-if="store.info&&route.path!=='/chat'"><img
              :src="store.avatar(store.info.friends.find(item => item.username === route.params.id).avatar)" alt="">
            </q-avatar>
            {{ route.params.id }}
          </div>
          <div v-else>
            Flypen
          </div>
        </q-toolbar-title>

        <div>C++ Course Design</div>
      </q-toolbar>
    </q-header>
    <q-dialog v-model="pickerShow">
      <q-card style="width: 80vw">
        <q-color v-model="hexa"/>
        <div class="row justify-end q-gutter-md q-mt-sm">
          <q-btn @click="pickerShow=false"> Cancel</q-btn>
          <q-btn @click="
    setColor">Confirm
          </q-btn>
        </div>
      </q-card>
    </q-dialog>

    <q-drawer bordered v-model="leftDrawerOpen">
      <div class="bg-primary column" v-if="store.info">
        <div class="q-pa-lg">
          <q-avatar @click="router.push('/avatar')" v-if="store.info" size="60px"><img
            :src="store.avatar(store.info.avatar)" alt=""></q-avatar>
        </div>
        <div class="q-px-lg text-white text-h6 q-pb-md">{{ store.info.username }}</div>
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

    <q-page-container style="display: flex">
      <q-page-container :class="{'is-mobile':store.isMobile,half:!store.isMobile}" class="no-padding" style="background: #fff">
        <router-view name="fakeSidebar"></router-view>
    </q-page-container>
      <q-page-container style="flex:1" :class="{half:!store.isMobile}" class="no-padding">
      <router-view v-slot="{ Component }">
        <transition
          enter-active-class="animated fadeInRight"
        >
          <component :is="Component"/>
        </transition>
      </router-view>
    </q-page-container>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import {useCheckStore} from 'stores/check';

const $q = useQuasar()
watch(
  () => $q.screen.width,
  (newWidth) => {
    if (route.path.includes('login')||route.path.includes('signup')||route.path.includes('avatar')||route.path.includes('file'))
      store.isMobile=true;
    else
    store.isMobile = newWidth < 450
  }
)
const setColor = () => {
  document.querySelector(':root').style.setProperty('--q-primary', hexa.value);
  pickerShow.value = false;
  store.info.color = hexa.value;
  $q.localStorage.set('info', store.info);
}
console.log($q.screen)
import {useRoute} from 'vue-router'
import {useQuasar} from 'quasar'
import {ref, watch} from 'vue';
import {useRouter} from 'vue-router';

const route = useRoute();
const hexa = ref('')
const store = useCheckStore();
const router = useRouter();
const pickerShow = ref(false);
const settings = () => {
  toggleLeftDrawer();
  pickerShow.value = true;
}
const leftDrawerOpen = ref(false);

watch(route, (newRoute) => {
  if (newRoute.path.includes('person')) {
    leftDrawerOpen.value = false
  }
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

function logout() {
  $q.localStorage.remove('token');
  store.info = null;
  store.history = null;
  store.order = null;
  router.push('/login')
}

store.history = $q.localStorage.getItem('history')
store.info = $q.localStorage.getItem('info')
store.order = $q.localStorage.getItem('order')
try {
  if (store.info.color) {
    document.querySelector(':root').style.setProperty('--q-primary', store.info.color);
    hexa.value= store.info.color;
  }
  else
    store.info.color='#1976d2'
  hexa.value= store.info.color;
} catch (e) {
}


</script>

<style scoped lang="scss">
.is-mobile{
  display: none;
}
.half{
  max-width: 50vw;
  overflow: hidden;
}

</style>
