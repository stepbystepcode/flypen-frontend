<template>
  <div style="width: 80vw; margin: 0 auto">
    <div class="column flex-center q-gutter-md">
      <div class="text-h4 q-pt-md">Flypen</div>
      <div class="text-h5">Create a Flypen Account</div>
      <span>Enter your name</span>
      <q-form>
        <q-input outlined v-model="username" :rules="[val => !!val || 'Field is required']" style="width: 80vw"
                 label="username"></q-input>
        <q-input outlined v-model="password" :rules="[val => !!val || 'Field is required']" type="password"
                 style="width: 80vw" label="password"></q-input>
        <div class="row flex-center justify-between" style="width: 95%">
          <div><a href="/login" class="text-primary text-bold" style="text-decoration: none">Go to Login</a></div>
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
      }).then(res=>{router.push('/avatar')});
    });
};
</script>
<style scoped></style>
