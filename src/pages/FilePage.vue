<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree v-if="final" :nodes="final"  node-key="label" />
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import axios from 'axios';

const raw=ref();
const final=ref();
axios.post('http://127.0.0.1:8081/api/file/tree').then(res=>{
  raw.value=res.data;
  transform(raw.value[0]);
  raw.value.pop();
  final.value=raw.value;
  console.log(final.value);
})
function transform(item) {
  delete item.type;
  item.label=item.name;
  delete item.name;
  if (item.contents) {
    item.children = item.contents;
    delete item.contents;
    item.children.forEach(transform);
  }
}


</script>

<style scoped>

</style>
