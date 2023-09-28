<template>
  <div style="width: 80vw; margin: 0 auto">
    <div class="column flex-center q-gutter-md">
      <div class="text-h4 q-pt-md">Flypen</div>
      <div class="text-h5">Create a Flypen Account</div>
      <span>Enter your name</span>
      <q-form>
        <q-input @keyup.enter="signup" outlined v-model="username" :rules="[val => !!val || 'Field is required']" style="width: 80vw"
          label="username"></q-input>
        <q-input @keyup.enter="signup" outlined v-model="password" :rules="[val => !!val || 'Field is required']" :type="isPwd ? 'password' : 'text'"
                 style="width: 80vw" label="password">
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
        <q-input @keyup.enter="signup" outlined v-model="passwordVer" lazy-rules :rules="[val => val===password || 'Two password not same']" :type="isPwd ? 'password' : 'text'"
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
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
const router = useRouter();
const username = ref('');
const password = ref('');
const passwordVer = ref('');
const isPwd=ref(true);
const signup = () => {
  axios
    .post('http://8.130.48.157:8081/api/signup', {
      username: username.value,
      password: password.value,
    })
    .then((res) => {
      const success = res.data.msg.includes('Success');
      if (success) {
        localStorage.setItem('token', res.data.token);
        Swal.fire({
          title: res.data.msg,
          icon: 'success',
        }).then(() => { router.push('/avatar') });
      } else Swal.fire({
        title: res.data.msg,
        icon: 'error',
      });
    });
};
</script>
<style scoped></style>
