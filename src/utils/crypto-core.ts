import _sodium from 'libsodium-wrappers';

import { LocalStorage, SessionStorage } from 'quasar'
const token = LocalStorage.getItem('token')
const config = {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application-json'
  }
}
import { api } from 'boot/axios';
import { log } from 'console';
const sodium = _sodium;
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
      function base64ToUint8Array(base64) {
        const binaryString = window.atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
      }

      function getKeyMaterial() {
        const password = window.prompt('Enter your password');
        const enc = new TextEncoder();
        return window.crypto.subtle.importKey(
          'raw',
          enc.encode(password),
          { name: 'PBKDF2' },
          false,
          ['deriveBits', 'deriveKey']
        );
      }
      function getKey(keyMaterial, salt) {
        return window.crypto.subtle.deriveKey(
          {
            'name': 'PBKDF2',
            salt: salt,
            'iterations': 100000,
            'hash': 'SHA-256'
          },
          keyMaterial,
          { 'name': 'AES-GCM', 'length': 256 },
          true,
          ['encrypt', 'decrypt']
        );
      }
      async function decrypt(salt,iv) {
        const encryptPrivateKey = await retrieveEncryptedPrivateKeyFromIndexedDB();
        const keyMaterial = await getKeyMaterial();
        const key = await getKey(keyMaterial, salt);

        try {
          const privateKey = await window.crypto.subtle.decrypt(
            {
              name: 'AES-GCM',
              iv: iv
            },
            key,
            new Uint8Array(encryptPrivateKey)
          );
          // console.log('unit8array', new Uint8Array(privateKey));

          return new Uint8Array(privateKey);
        } catch (e) {
          console.log('Decryption error: ', e);
        }
      }

export const encode=(message,username)=>{
  console.log('用谁的公钥加密:',username);
  
     api.get(`/api/getKey?recipient=${username}`).then(async(response) => {
      console.log(username,'公钥：',sodium.from_hex(response.data.public_key));
      const receiverPublicKey = sodium.from_hex(response.data.public_key);
      //const receiverPublicKey = sodium.crypto_box_keypair().publicKey;
      //decrypt begin

      const salt = base64ToUint8Array(localStorage.getItem('salt'));
      const iv = base64ToUint8Array(localStorage.getItem('iv'));

      decrypt(salt,iv).then((privateKey) => {
        const messageBytes = sodium.from_string(message);
        const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
        // console.log('lj3私钥：', privateKey);
        // console.log('lj2公钥：', receiverPublicKey);
        const encrypted = sodium.crypto_box_easy(messageBytes, nonce, receiverPublicKey, privateKey);
        console.log('encrypted:', encrypted);
        // const decrypted = sodium.crypto_box_open_easy(encrypted, nonce, receiverPublicKey, privateKey);
        console.log('Encrypted:', sodium.to_hex(encrypted));
        // console.log('Decrypted:', sodium.to_string(decrypted));

        // socket.send(JSON.stringify({
        //   type: 'message',
        //   recipient: recipientUserId, 
        //   nonce: sodium.to_hex(nonce),
        //   ciphertext: sodium.to_hex(encrypted)
        // }));
        api.post('/api/chat', {
          content: sodium.to_hex(encrypted),
          receiver: username
        }, config
        );
      });
    });
}
export const decode = (message,username)=>{
     api.get(`/api/getKey?recipient=${username}`).then(async(response) => {
      const receiverPublicKey = sodium.from_hex(response.data.public_key);
      console.log(username,'公钥：',sodium.from_hex(response.data.public_key));
      //const receiverPublicKey = sodium.crypto_box_keypair().publicKey;
      //decrypt begin

      const salt = base64ToUint8Array(localStorage.getItem('salt'));
      const iv = base64ToUint8Array(localStorage.getItem('iv'));

      decrypt(salt,iv).then((privateKey) => {
        console.log('message:', message);
        
        const nonce = sodium.randombytes_buf(sodium.crypto_box_NONCEBYTES);
        // const encrypted = sodium.crypto_box_easy(messageBytes, nonce, receiverPublicKey, privateKey);
        // console.log('lj2私钥：', privateKey);
        // console.log('lj3公钥：', receiverPublicKey);
        const decrypted = sodium.crypto_box_open_easy(message, nonce, receiverPublicKey, privateKey);
        // console.log('Encrypted:', sodium.to_hex(encrypted));
        console.log('Decrypted:', sodium.to_string(decrypted));

        // socket.send(JSON.stringify({
        //   type: 'message',
        //   recipient: recipientUserId, 
        //   nonce: sodium.to_hex(nonce),
        //   ciphertext: sodium.to_hex(encrypted)
        // }));

        // api.post('/api/chat', {
        //   content: sodium.to_hex(encrypted),
        //   receiver: route.params.id
        // }, config
        // );

        
      });
    });
}