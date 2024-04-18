<template>
  <div style="width: 80vw; margin: 0 auto">
    <div class="column flex-center q-gutter-md">
      <img src="https://img1.imgtp.com/2023/10/03/o67coRDY.svg" alt="" style="width: 30vw" class="q-pt-md">
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
import {api} from 'boot/axios';
import {ref} from 'vue';
import Swal from 'sweetalert2';
import {useRouter} from 'vue-router';
import _sodium from 'libsodium-wrappers';

const router = useRouter();
const username = ref('');
const password = ref('');
const passwordVer = ref('');
const isPwd = ref(true);
// function validatePassword(password) {
//   return (
//     password.length > 8 &&
//     password !== password.toUpperCase() &&
//     password !== password.toLowerCase() &&
//     /\d/.test(password)
//   );
// }
const signup = async () => {
  // 将加密后的私钥存储到IndexedDB
async function storeEncryptedPrivateKeyInIndexedDB(encryptedPrivateKey) {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('chat-app-db', 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      const objectStore = db.createObjectStore('encrypted-private-keys', { keyPath: 'id' });
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['encrypted-private-keys'], 'readwrite');
      const objectStore = transaction.objectStore('encrypted-private-keys');

      const id = 'private-key';
      objectStore.put({ id, encryptedPrivateKey }).onsuccess = () => {
        resolve();
      };
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

// 从IndexedDB读取加密私钥
async function retrieveEncryptedPrivateKeyFromIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open('chat-app-db', 1);

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(['encrypted-private-keys'], 'readonly');
      const objectStore = transaction.objectStore('encrypted-private-keys');
      const getRequest = objectStore.get('private-key');

      getRequest.onsuccess = () => {
        resolve(getRequest.result.encryptedPrivateKey);
      };

      getRequest.onerror = (event) => {
        reject(event.target.error);
      };
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}
  if (username.value === '' || password.value === '' || passwordVer.value === '')
    Swal.fire({
      title: 'Please fill out all required fields.',
      icon: 'error',
    });
  // else if (!validatePassword(password.value))
  //   Swal.fire({
  //     icon: 'error',
  //     title: 'Invalid Password',
  //     text: 'Password must contain both uppercase and lowercase letters plus numbers',
  //   });
  else if (password.value !== passwordVer.value) Swal.fire({
    title: 'Passwords do not match',
    icon: 'error',
  });
  else{
    // 加载libsodium库
await _sodium.ready;
const sodium = _sodium;

// 生成密钥对和预缓存密钥数组
const keyPair = sodium.crypto_box_keypair(); // 密钥对
const preKeys = []; // 预缓存密钥数组
for (let i = 0; i < 100; i++) {
  preKeys.push(sodium.crypto_box_keypair());
}
const privateKey = keyPair.privateKey;

// 设置用户密码
const userPassword = password.value;
// 使用 PBKDF2 派生一个加密密钥。
const salt = crypto.getRandomValues(new Uint8Array(16));
const iterations = 100000;
const keyLength = 256;
const encryptionKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(userPassword), 'PBKDF2', false, ['deriveKey']);
const derivedKey = await crypto.subtle.deriveKey(
  {
    name: 'PBKDF2',
    salt,
    iterations,
    hash: 'SHA-256',
  },
  encryptionKey,
  { name: 'AES-GCM', length: keyLength },
  true,
  ['encrypt', 'decrypt']
);

// 使用 AES-GCM 算法加密私钥,并将加密后的私钥存储到 IndexedDB 数据库。
const encryptedPrivateKey = await crypto.subtle.encrypt(
  {
    name: 'AES-GCM',
    iv: crypto.getRandomValues(new Uint8Array(12)),
  },
  derivedKey,
  privateKey
);
console.log(encryptedPrivateKey);

await storeEncryptedPrivateKeyInIndexedDB(encryptedPrivateKey);
console.log('Encrypted private key stored in IndexedDB');
    api
      .post('/api/signup', {
        username: username.value,
        password: password.value,
        publicKey: sodium.to_hex(keyPair.publicKey),
        preKeys: preKeys.map(k => sodium.to_hex(k.publicKey)) 
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
  }
};
</script>
<style scoped></style>
