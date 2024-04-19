<template>
  <q-page class="column">
    <div class="tgme_background_wrap">
      <canvas id="tgme_background" class="tgme_background default" width="50" height="50"
        data-colors="9fb0ea,bbead5,b0cdeb,b2e3dd"></canvas>
      <div style="background-image: url('https://img1.imgtp.com/2023/10/03/3j6Atqox.svg')"
        class="tgme_background_pattern default"></div>
    </div>
    <!--    <div v-if="store" id="content" style="flex:1;background: url(/bg.svg)"-->
    <!--         class="q-pa-md q-mb-xl">-->
    <div class=" q-pa-md q-mb-xl">
      <q-chat-message v-for="(item, i) in store.history[route.params.id]" :key="i"
        :avatar="store.avatar(item.sender === route.params.id ? yourAvatar : myAvatar)"
        :bg-color="`${item.sender == route.params.id ? 'white' : 'info'}`" :text="[item.content]" :stamp="item.time"
        :data-name="item.sender" @click="Profile" :sent="item.sender != route.params.id" />
    </div>
    <div class="row fixed bg-white" :class="store.isMobile ? 'window-width' : 'half-width'" style="bottom:0">
      <q-input borderless v-model="message" placeholder="Message" style="flex:1" class="q-px-md"
        @keyup.enter="sendMessage()"></q-input>
      <p class="ciphertext-value"></p>
      <p class="decrypted-value"></p>
      <q-btn @click="sendMessage()" flat :disable="!message.length">
        <q-icon color="primary" name="send"></q-icon>
      </q-btn>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import _sodium from 'libsodium-wrappers';
import myBg from '../boot/bg.js';
import { onMounted, ref } from 'vue'
import axios, { api } from 'boot/axios';
import { useRoute } from 'vue-router'
import { useCheckStore } from 'stores/check';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
let socket: WebSocket;

await _sodium.ready;
const sodium = _sodium;
const router = useRouter();
const store = useCheckStore();
const myAvatar = store.info.avatar
const yourAvatar = ref('');
const route = useRoute();
const message = ref('');
const $q = useQuasar()
const token = $q.localStorage.getItem('token')
const config = {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application-json'
  }
}

// const update = () => {
//   api.post('/api/check', {
//       person: route.params.id
//     }, config
//   ).then((res) => {
//     history.value = res.data
//   })
// }

const Profile = (e) => {
  if (e.srcElement.parentElement.parentElement.parentElement.dataset?.name) {
    router.push(`/profile/${e.srcElement.parentElement.parentElement.parentElement.dataset?.name}`)
  }
}
onMounted(() => {
  socket = new WebSocket("ws://localhost:9001/");
  // setInterval(update, 500);
  api.post('/api/info', {
    person: route.params.id
  }, config
  ).then((res) => {
    const username = store.info.username
    if (!res.data.message[username].friends.find(item => item.username === route.params.id)) {
      Swal.fire({
        title: 'Oops...',
        text: 'You are not friends with this person!',
        icon: 'error',
        confirmButtonText: 'OK'
      }).then(() => {
        router.push('/chat')
      });
    }
    store.info = {
      ...store.info,
      ...res.data.message[route.params.id],
      friends: store.info.friends,
      avatar: store.info.avatar
    };
    $q.localStorage.set('info', store.info)
    yourAvatar.value = store.info.friends.find(item => item.username === route.params.id).avatar
  });
  setTimeout(() => {
    window.scrollTo(0, document.body.scrollHeight)
  }, 1000);
  myBg.init();
})
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
const sendMessage = async () => {
  try {
    if (!message.value.length) return;
    if (message.value.length > 100) {
      $q.notify({
        message: 'Message too long!',
        type: 'warning',
        color: 'yellow',
        position: 'bottom'
      })
      return
    }
    // api.get(`/api/getKey?recipient=${route.params.id}`).then((response) => {
    //const receiverPublicKey = sodium.from_hex(response.data);
    const receiverPublicKey = sodium.crypto_box_keypair().publicKey;
    const encryptPrivateKey = await retrieveEncryptedPrivateKeyFromIndexedDB();
    //decrypt begin

    function base64ToUint8Array(base64) {
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes;
    }
    const salt = base64ToUint8Array(localStorage.getItem('salt'));
    const iv = base64ToUint8Array(localStorage.getItem('iv'));
    function getKeyMaterial() {
      let password = window.prompt("Enter your password");
      let enc = new TextEncoder();
      return window.crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
      );
    }
    function getKey(keyMaterial, salt) {
      return window.crypto.subtle.deriveKey(
        {
          "name": "PBKDF2",
          salt: salt,
          "iterations": 100000,
          "hash": "SHA-256"
        },
        keyMaterial,
        { "name": "AES-GCM", "length": 256 },
        true,
        ["encrypt", "decrypt"]
      );
    }
    async function decrypt() {
      let keyMaterial = await getKeyMaterial();
      let key = await getKey(keyMaterial, salt);

      try {
        const privateKey = await window.crypto.subtle.decrypt(
          {
            name: "AES-GCM",
            iv: iv
          },
          key,
          new Uint8Array(encryptPrivateKey)
        );
        // 处理解密后的Uint8Array，不进行字符串转换
        console.log("Decrypted data:", privateKey);
        console.log("unit8array", new Uint8Array(privateKey));
        
        return privateKey;
      } catch (e) {
        console.log("Decryption error: ", e);
      }
    }


    //decrypt end
    const privateKey=decrypt();
    console.log("my");
    console.log(privateKey);
    console.log("target");
    console.log(sodium.crypto_box_keypair().privateKey);
    
    
    const messageBytes = sodium.from_string(message.value);
    const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
    const encrypted = sodium.crypto_box_easy(messageBytes, nonce, receiverPublicKey, privateKey);
    const decrypted = sodium.crypto_box_open_easy(encrypted, nonce, receiverPublicKey, privateKey);
    const decryptedMessage = sodium.to_string(decrypted);
    console.log('Encrypted:', sodium.to_hex(encrypted));
    console.log('Decrypted:', decryptedMessage);


    socket.send(JSON.stringify({
      type: 'message',
      recipient: recipientUserId, 
      nonce: sodium.to_hex(nonce),
      ciphertext: sodium.to_hex(ciphertext)
    }));
    api.post('/api/chat', {
      content: encryptedMessageBase64,
      receiver: route.params.id
    }, config
    );
    message.value = '';
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: 'smooth'
      });
    }, 900);
    // });
  } catch (error) {
    console.log(error)
  }
}


</script>
<style scoped lang="scss">
.tgme_background {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
}

.tgme_background_pattern.default {
  opacity: 0.3;
  background-image: url(/bg.svg);
}

.tgme_background_wrap {
  display: flex;
  position: absolute;
  height: 100%;
  width: 100vw;
}

.tgme_background_pattern {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  mix-blend-mode: overlay;
  background: center repeat;
  background-size: 420px auto;
}

.half-width {
  width: 50vw;
}
</style>
