<template>
  <div style="width: 80vw; margin: 0 auto">
    <div class="column flex-center q-gutter-md">
      <div class="text-h4 q-pt-md">Flypen</div>
      <div class="text-h5">Sign in</div>
      <span>Use your Flypen Account</span>
      <q-input
        outlined
        v-model="username"
        style="width: 80vw"
        label="username"
      ></q-input>
      <q-input
        outlined
        v-model="password"
        style="width: 80vw"
        label="password"
      ></q-input>
      <div class="row flex-center justify-between" style="width: 95%">
        <div><a href="/signup" class="text-primary text-bold" style="text-decoration: none">Create account</a></div>
        <q-btn @click="login" class="bg-primary text-white text-bold">登录</q-btn>
      </div>
    </div>
  </div>
</template>
<script setup>
import axios from 'axios';
import { ref } from 'vue';
import Swal from 'sweetalert2';
const username = ref('');
const password = ref('');
const login = () => {
  axios
    .post('http://127.0.0.1:8081/api/login', {
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
<style scoped>
.swal2-container {
  z-index: 10000 !important;
}
</style>
