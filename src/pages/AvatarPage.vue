
<template>
  <div style="width: 80vw; margin: 0 auto">
    <h4>Choose your photo</h4>
        <div style="display: grid;grid-template-columns: repeat(4,1fr)">
          <div v-for="i in 40" class="row flex-center" :key="i" @click="console.log(i);selectAvatar(i)">
            <img :src="`/avatar/${i}.jpeg`" alt="" style="width: 60px; height: 60px; margin: 3px">
          </div>
        </div>
	<q-btn @click="setAvatar" class="bg-primary text-white">finish</q-btn>
      </div>
</template>
<script setup>
import axios from 'axios';
import {ref} from 'vue';
import Swal from 'sweetalert2';

const username = ref('');
const password = ref('');
const avatar = ref(0);
const selectAvatar = (num) => {
  avatar.value = num;
};
const setAvatar = () => {
  axios
    .post('http://127.0.0.1:8081/api/avatar', {
      avatar: avatar.value,
    })
    .then((res) => {
      Swal.fire({
        title: res.data.msg,
        icon: res.data.msg.includes('Success') ? 'success' : 'error',
      });
    });
};
</script>
<style scoped></style>
