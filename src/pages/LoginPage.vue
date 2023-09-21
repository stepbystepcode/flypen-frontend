<template>
    <div style="width: 80vw; margin: 0 auto">
        <div class="column flex-center q-gutter-md">
            <div class="text-h4 q-pt-md">Flypen</div>
            <div class="text-h5">Sign in</div>
            <span>Use your Flypen Account</span>
            <q-input @keyup.enter="login" outlined v-model="username" style="width: 80vw" label="username"></q-input>
            <q-input @keyup.enter="login" outlined v-model="password" :type="isPwd ? 'password' : 'text'" style="width: 80vw" label="password">
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <div class="row flex-center justify-between" style="width: 95%">
                <div @click="router.push('/signup')" class="text-primary text-bold">Create account</div>
                <q-btn @click="login" class="bg-primary text-white text-bold">login</q-btn>
            </div>
        </div>
    </div>
</template>
<script setup>
import axios from 'axios';
import { ref } from 'vue';
import Swal from 'sweetalert2';
import {useRouter} from "vue-router";
const router = useRouter();
const username = ref('');
const password = ref('');

const isPwd=ref(true);
const login = () => {
    axios
        .post('http://8.130.48.157:8081/api/login', {
            username: username.value,
            password: password.value,
        })
        .then((res) => {
            const success = res.data.msg.includes('Success');
            if (success) {
                localStorage.setItem('username', res.data.username);
                localStorage.setItem('token', res.data.token);
              Swal.fire({
                title: res.data.msg,
                icon: success ? 'success' : 'error',
              }).then(() => { router.push('/chat') });
            }
        })
};
</script>
<style scoped></style>
