
<template>
  <div style="width: 80vw; margin: 0 auto">
    <div class="text-h4 q-my-sm">Choose your photo</div>
    <div style="display: grid;grid-template-columns: repeat(4,1fr)">
      <div v-for="i in 40" class="row flex-center" :key="i" @click="console.log(i); selectAvatar(i)"
        :style="`border:${avatar === i ? '4px #1976D2 solid' : '4px #fff solid'}`">
        <img :src="`/avatar/${i}.jpeg`" alt="" style="width: 60px; height: 60px">
      </div>
    </div>
    <div class="row justify-end q-my-md">
      <q-btn @click="setAvatar" class="bg-primary text-white">finish</q-btn>
    </div>
  </div>
</template>
<script setup>
import axios from 'axios';
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
const router = useRouter();

const avatar = ref(0);
const selectAvatar = (num) => {
  avatar.value = num;
};
const setAvatar = () => {
  axios
    .post(`http://8.130.48.157:8081/api/avatar?avatar=${avatar.value}`, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
    .then((res) => {
      Swal.fire({
        title: res.data,
        icon: res.data.includes('Success') ? 'success' : 'error',
      }).then(
        () => { localStorage.setItem('avatar', avatar.value); router.push('/chat'); }
      );
    });
};
</script>
<style scoped></style>
