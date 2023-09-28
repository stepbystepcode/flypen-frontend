<template>
  <div style="width: 80vw; margin: 0 auto">
    <div class="column flex-center q-gutter-md">
      <img src="/logo.svg" alt="" style="width: 30vw" class="q-pt-md">
      <div class="text-h4" style="color:#3770c1">Flypen</div>
      <div class="text-h5">Create a Flypen Account</div>
      <span>Enter your name</span>
      <q-form class="q-gutter-y-sm">
        <q-input @keyup.enter="signup" outlined v-model="username" style="width: 80vw"
                 label="username"></q-input>
        <q-input @keyup.enter="signup" outlined v-model="password" :type="isPwd ? 'password' : 'text'"
                 style="width: 80vw" label="password">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-input @keyup.enter="signup" outlined v-model="passwordVer" lazy-rules
                 :rules="[val => val===password || 'Two password not same']" :type="isPwd ? 'password' : 'text'"
                 style="width: 80vw" label="password">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <div class="row flex-center justify-between" style="width: 95%">
          <div @click="router.push('/login')" class="text-primary text-bold">Go to Login</div>
          <q-btn @click="signup" class="bg-primary text-white">next</q-btn>
        </div>
      </q-form>
    </div>
  </div>
</template>
<script setup>
import axios from 'axios';
import {ref} from 'vue';
import Swal from 'sweetalert2';
import {useRouter} from 'vue-router';

const router = useRouter();
const username = ref('');
const password = ref('');
const passwordVer = ref('');
const isPwd = ref(true);
function validatePassword(password) {
  return (
    password.length > 8 &&
    password !== password.toUpperCase() &&
    password !== password.toLowerCase() &&
    /\d/.test(password)
  );
}
const signup = () => {
  if (username.value === '' || password.value === '' || passwordVer.value === '')
    Swal.fire({
      title: 'Please fill out all required fields.',
      icon: 'error',
    });
  else if (validatePassword(password.value))
    Swal.fire({
      icon: 'error',
      title: 'Invalid Password',
      text: 'Password must contain both uppercase and lowercase letters plus numbers',
    });
  else if (password.value !== passwordVer.value) Swal.fire({
    title: 'Passwords do not match',
    icon: 'error',
  });
  else
    axios
      .post('http://8.130.48.157:8081/api/signup', {
        username: username.value,
        password: password.value,
      })
      .then((res) => {
        const success = res.data.code === 200;
        if (success) {
          localStorage.setItem('token', res.data.token);
          Swal.fire({
            title: res.data.msg,
            icon: 'success',
          }).then(() => {
            router.push('/avatar')
          });
        } else Swal.fire({
          title: res.data.msg,
          icon: 'error',
        });
      });
};
</script>
<style scoped></style>
