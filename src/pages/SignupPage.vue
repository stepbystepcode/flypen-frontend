<template>
    <div class="column flex-center fullscreen q-gutter-md">
    <q-input outlined v-model="username" label="username"></q-input>
    <q-input outlined v-model="password" label="password"></q-input>
    <q-btn @click="signup">注册</q-btn>
</div></template>
<script setup>
import axios from 'axios';
import {ref} from 'vue'
import Swal from 'sweetalert2'
const username=ref('');
const password=ref('');
const signup = () => {
    axios.post('http://192.168.41.231:8081/api/signup',{username:username.value,password:password.value}).then((res)=>{
        Swal.fire(res.data.msg);
    });
}
</script>
<style scoped>
.swal2-container {
  z-index: 10000 !important;
}
</style>