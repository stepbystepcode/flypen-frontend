<template>
  <q-page>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import {useRouter} from 'vue-router';
const router = useRouter();
if(localStorage.getItem('token') === null) router.push('/login');
else router.push('/chat');
</script>
