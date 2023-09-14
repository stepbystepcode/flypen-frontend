<template>
  <q-page class="column items-center justify-evenly">
    <q-input outlined v-model="message"></q-input>
   <q-btn @click="sendMessage()">send message</q-btn>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const message=ref('123');
const socket = new WebSocket('ws://192.168.41.231:8081/api/chat');

socket.onopen = function(e) {
  console.log("[open] Connection established");
  console.log("Sending to server");
  socket.send("My name is John");
};

socket.onmessage = function(event) {
  console.log(`[message] Data received from server: ${event.data}`);
};

socket.onclose = function(event) {
  if (event.wasClean) {
    console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
  } else {
    // e.g. server process killed or network down
    // event.code is usually 1006 in this case
    console.log('[close] Connection died');
  }
};

socket.onerror = function(error) {
  console.log(error);
};
function sendMessage() {
    socket.send(message.value);
}
</script>
