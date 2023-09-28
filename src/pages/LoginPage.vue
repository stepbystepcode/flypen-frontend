<template>
  <div style="width: 80vw; margin: 0 auto">
    <div class="column flex-center q-gutter-md">
      <img src="/logo.svg" alt="" style="width: 30vw" class="q-pt-md">
      <div class="text-h4" style="color:#3770c1">Flypen</div>
      <div class="text-h5">Sign in</div>
      <span>Use your Flypen Account</span>
      <q-input @keyup.enter="login" outlined v-model="username" style="width: 80vw" label="username"></q-input>
      <q-input @keyup.enter="login" outlined v-model="password" :type="isPwd ? 'password' : 'text'" style="width: 80vw"
               label="password">
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
import {ref} from 'vue';
import Swal from 'sweetalert2';
import {useRouter} from 'vue-router';
import {useCheckStore} from 'stores/check';
import { useQuasar } from 'quasar'
const store = useCheckStore();
const router = useRouter();
const username = ref('');
const password = ref('');
const $q = useQuasar()
const isPwd = ref(true);
const login = () => {
  if (username.value === '' || password.value === '')
    Swal.fire({
      title: 'Please fill out all required fields.',
      icon: 'error',
    });
  else axios
    .post('http://8.130.48.157:8081/api/login', {
      username: username.value,
      password: password.value,
    })
    .then((res) => {
      const success = res.data.code === 200;
      if (success) {
        store.info = res.data;
        //localStorage.setItem('token', res.data.token);
        $q.localStorage.set('token', res.data.token)
        $q.localStorage.set('info', res.data)
        const token=res.data.token;
        axios.post('http://8.130.48.157:8081/api/info', {
            person: ''
          }, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application-json'
            }
          }
        ).then(res => {
          store.info = {...store.info,...res.data.message[store.info.username]};
          $q.localStorage.set('info', store.info)
        });
        axios.post('http://8.130.48.157:8081/api/check?type=all', null, {
          headers: {
            'Authorization': `Bearer ${token}`
          }})
          .then(res => {
            store.history = res.data.message;
            $q.localStorage.set('history', store.history)
          })
        Swal.fire({
          title: res.data.msg,
          icon: 'success',
        }).then(() => {
          router.push('/chat')
        });
      }else
        Swal.fire({
          title: res.data.msg,
          icon: 'error'
        })
    })
};
</script>
<style scoped></style>
