
<template>
  <div style="width: 80vw; margin: 0 auto">
    <h4>Choose your photo</h4>
        <div style="display: grid;grid-template-rows: repeat(4,1fr);grid-template-columns: repeat(4,1fr)">
          <div v-for="i in 40" :key="i" @click="console.log(i);selectAvatar(i)">
            <img :src="`/avatar/${i}.jpeg`" alt="" style="width: 50px; height: 50px; margin: 5px">
          </div>
        </div>
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
  Swal.close();
};
const signup = () => {
  axios
    .post('http://127.0.0.1:8081/api/signup', {
      username: username.value,
      password: password.value,
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
