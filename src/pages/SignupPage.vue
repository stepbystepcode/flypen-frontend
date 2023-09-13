<template>
    <div class="column flex-center fullscreen q-gutter-md">
    <q-input outlined v-model="username" label="username"></q-input>
    <q-input outlined v-model="password" label="password"></q-input>
    <q-btn @click="signup">注册</q-btn>
</div></template>
<script setup>
import axios from 'axios';
import {ref} from 'vue'
const username=ref('');
const password=ref('');
const signup = () => {
    axios.post('http://127.0.0.1:8080/signup',{username:username.value,password:password.value});
}
</script>