
<template>
  <div style="width: 80vw; margin: 0 auto">
    <div class="text-h4 q-my-sm">Choose your photo</div>
    <div style="display: grid;grid-template-columns: repeat(4,1fr)">
      <div v-for="i in 32" class="row flex-center" :key="i" @click="selectAvatar(i-1)"
        :style="`border:${avatar === i-1 ? '4px #1976D2 solid' : '4px #fff solid'}`">
        <img :src="store.avatar(i-1)" alt="" style="width: 60px; height: 60px">
      </div>
    </div>
    <div class="row justify-end q-my-md">
      <q-btn @click="setAvatar" :disable="!avatar" class="bg-primary text-white">finish</q-btn>
    </div>
  </div>
</template>
<script setup>
import { api } from 'boot/axios';
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import {useCheckStore} from 'stores/check';
const store = useCheckStore();
import {useQuasar} from 'quasar';
const $q = useQuasar();
const router = useRouter();

const avatar = ref(0);
const selectAvatar = (num) => {
  avatar.value = num;
};
const setAvatar = () => {
  api
    .post(`/api/avatar?avatar=${avatar.value}`, {}, {
      headers: {
        'Authorization': `Bearer ${$q.localStorage.getItem('token')}`,
      }
    })
    .then((res) => {
      Swal.fire({
        title: res.data,
        icon: res.data.includes('Success') ? 'success' : 'error',
      }).then(
        () => { Swal.fire('Login Expired. Please login again.'); router.push('/login'); }
      );
    });
};
</script>
<style scoped></style>
