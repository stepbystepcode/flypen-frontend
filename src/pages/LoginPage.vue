<template>
    <div style="width: 80vw; margin: 0 auto">
        <div class="column flex-center q-gutter-md">
            <div class="text-h4 q-pt-md">Flypen</div>
            <div class="text-h5">Sign in</div>
            <span>Use your Flypen Account</span>
            <q-input outlined v-model="username" style="width: 80vw" label="username"></q-input>
            <q-input outlined v-model="password" type="password" style="width: 80vw" label="password"></q-input>
            <div class="row flex-center justify-between" style="width: 95%">
                <div><a href="/signup" class="text-primary text-bold" style="text-decoration: none">Create account</a></div>
                <q-btn @click="login" class="bg-primary text-white text-bold">login</q-btn>
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
            const success = res.data.msg.includes('Success');
            if(success) {
              localStorage.setItem('username', res.data.username);
              localStorage.setItem('token', res.data.token);
              window.location.href = '/';
            }
            Swal.fire({
                title: res.data.msg,
                icon: success ? 'success' : 'error',
            });
        })
};
</script>
<style scoped></style>
