<template>
  <div class="row no-wrap">
    <div class="q-pa-md q-gutter-sm">
      <q-tree v-if="final" ref="tree" :nodes="final" node-key="label" style="min-width: 27vw;max-width: 27vw;"
        selected-color="primary" v-model:selected="filename" @update:selected="select(filename)" default-expand-all />
    </div>
    <div class="container">
      <div class="content">
        <div class="box">
          <span>file name</span>
          <input type="text" class="input" v-model="filename">
        </div>
        <div class="box">
          <Editor v-model="content" @imgAdd="imgAdd" />
          <div class="q-mt-md row justify-end">
            <q-btn class="bg-primary text-white" style="width: 5rem;" @click="check()">Save</q-btn>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Editor from '../components/EditorComponent.vue'
import { ref } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2'
const raw = ref();
const final = ref();
const lastSelect = ref();
const filename = ref('');
const tree = ref(null);
const select = (file) => {
  if(filename.value==null) return;
    const node = tree.value.getNodeByKey(file);
    if (node.icon === 'folder') {
      // 如果是文件夹,选择保持为上一次选择
      tree.value.setExpanded(file, !tree.value.isExpanded(file));
      filename.value = lastSelect.value;
    } else {
      // 如果是文件,更新最后选择  
      lastSelect.value = filename.value;
    }
axios.post(`http://192.168.184.81:8081/api/file/cat?path=${filename.value}`).then(res => {
  console.log(res.data);
  content.value=res.data;
})
    console.log(node);
}
axios.post('http://192.168.184.81:8081/api/file/tree').then(res => {
  console.log(res.data);
  raw.value = res.data;
  transform(raw.value[0]);
  raw.value.pop();
  final.value = raw.value;
})
function transform(item) {
  delete item.type;
  item.label = item.name;
  delete item.name;
  if (item.contents) {
    item.icon = 'folder';
    item.children = item.contents;
    delete item.contents;
    item.children.forEach(transform);
  } else item.icon = 'insert_drive_file';
}


let content = ref('');
const imgnum = ref(0);
const imgAdd = (pos, file) => {
  console.log(file);
  const formData = new FormData()
  formData.append('image', file);
  axios.post('https://www.imgtp.com/api/upload', formData, {
    headers: {
      'token': '1fee373d94bf7bf2b87fcbf756b716d2',
      'content-type': 'multipart/form-data'
    }
  }).then(({ data }) => {
    const url = data.data.url;
    content.value = content.value.replace(/!\[[^\]]+\]\([^)]+\)/, `![](${url})`);
    imgnum.value++;
  })
}
const check = () => {
  if (content.value.length === 0) Swal.fire('Content is empty', 'info')
  else if (filename.value == '') Swal.fire('Please input filename', 'info')
  else submint()
}
let submint = () => {
  if (content.value != '' && title.value != '') {
    const json = JSON.stringify({
      content: content.value,
      filename: title.value,
      time: new Date().getTime()
    });
    axios.post('https://www.codehelp.cn:3000/api/ask', json, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    Swal.fire('Save success', '', 'success').then(window.location.reload())
  }
}
</script>

<style lang="scss" scoped>
.content {
  padding: 24px;

  .box {
    padding: 24px;
    border: 1px solid #e3e6e8;
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    margin-top: 12px;

    span {
      padding-bottom: 1em;
    }

    .input {
      flex: 1;
      outline: rgb(107, 137, 147);
      border: 1px solid #babfc4;
      border-radius: 3px;
      display: flex;

      &:focus {
        border: 1px solid #6bbbf7;
        box-shadow: 0 0 0 4px hsla(206, 100%, 40%, .15);
      }

      input {
        border: none;
        outline: none;
        flex: 1;
        padding: .6em .7em;
      }
    }

    input {
      padding: .6em .7em;
    }
  }

}

.pill {
  display: inline-block;
  margin: 2px;
  background: #e1ecf4;
  padding: 8px;
  color: #39739d;
  border-radius: 3px;
  font-size: 12px;
}
</style>
