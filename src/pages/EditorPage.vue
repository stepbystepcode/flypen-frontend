<template>
  <div class="window-width row">
    <q-btn-group style="flex:1" class="justify-around">
      <q-btn :icon="copyed?'o_content_paste':'o_file_copy'" @click="copyed?paste(1):cpmv(1)"/>
      <q-btn :icon="moved?'o_content_paste':'o_drive_file_move'" @click="moved?paste(2):cpmv(2)"/>
      <q-btn icon="o_delete" @click="deleteFile"/>
      <q-btn icon="o_create_new_folder" @click="addFolder"/>
      <q-btn icon="o_note_add" @click="touch"/>
    </q-btn-group>
  </div>
  <div class="row">
    <div class="q-pa-md q-gutter-sm">
      <q-tree v-if="final" ref="treeObj" :nodes="final" node-key="key"
              selected-color="primary" v-model:selected="key" @update:selected="select(key)" default-expand-all/>
    </div>
    <div style="width: 100vw;display: flex">
      <div class="q-ma-sm">file name</div>
      <input type="text" class="input" v-model="selectFile">
    </div>
    <div style="width: 100vw">
      <Editor style="z-index: 50" v-model="content" @imgAdd="imgAdd"/>
      <div class="q-mt-md row justify-end">
        <q-btn class="bg-primary text-white" style="width: 5rem;" @click="save()">Save</q-btn>
      </div>
    </div>
  </div>
</template>

<script setup>
import Editor from '../components/EditorComponent.vue'
import commandReq from 'components/commandReq';
import {ref, onMounted} from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2'
import {useQuasar} from 'quasar';

const $q = useQuasar();
const copyed = ref(false);
const moved = ref(false);
const copyfile = ref('');
const movefile = ref('');
const selectFile = ref('');
const raw = ref();
const final = ref();
const key = ref('');
const treeObj = ref(null);
const selectNode = ref(null);
const selectFolder = ref('');
const touch = () => {
  if (selectFolder.value === null) Swal.fire('Please select folder', '', 'warning')
  else {
    Swal.fire({
      title: 'Please input file name',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Create',
      showLoaderOnConfirm: true,
      preConfirm: (login) => {
        commandReq(5, selectFolder.value + login, '').then(res => {
          if (res.data.code === 200) Swal.fire('Success', '', 'success').then(() => {
            commandReq(0, '', '').then(res => {
              tree(JSON.parse(res.data.message));
            })
          })
          else Swal.fire('Fail', '', 'error')
        })
      }
    })
  }

}
const addFolder = () => {
  if (selectFolder.value === '') Swal.fire('Please select folder', '', 'warning')
  else {
    Swal.fire({
      title: 'Please input folder name',
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Create',
      showLoaderOnConfirm: true,
      preConfirm: (login) => {
        commandReq(4, selectFolder.value + login, '').then(res => {
          if (res.data.code === 200) Swal.fire('Success', '', 'success').then(() => {

            commandReq(0, '', '').then(res => {
              tree(JSON.parse(res.data.message));
            })
          })
          else Swal.fire('Fail', '', 'error')
        })
      }
    })
  }
}

const deleteFile = () => {
  if (selectFile.value === '' && selectFolder.value === '') Swal.fire('Please select file or folder', '', 'warning')
  else {
    Swal.fire({
      title: 'Confirm delete?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1976D2',
      cancelButtonColor: '#868686',
      reverseButtons: true,
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isDismissed) return;
      commandReq(3, selectNode.value.path, '')
      Swal.fire('Success', '', 'success').then(() => {

        commandReq(0, '', '').then(res => {
          tree(JSON.parse(res.data.message));
        })
      })
    })
  }
}

const save = () => {
  if (selectFile.value === '') Swal.fire('Please input filename', '', 'warning')
  else if (content.value === '') Swal.fire('Content is empty', '', 'warning')
  else {
    Swal.fire({
      title: 'Confirm save?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#1976D2',
      cancelButtonColor: '#868686',
      reverseButtons: true,
      confirmButtonText: 'Save',
    }).then((result) => {
      if (result.isDismissed) return;
      const json = JSON.stringify({
        content: content.value,
        filename: selectFolder.value + '/' + selectFile.value,
        //time: new Date().getTime()
      });
      axios.post('http://8.130.48.157:8081/api/file/save', json, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${$q.localStorage.getItem('token')}`
        }
      }).then(() => {
        Swal.fire('Save success', '', 'success').then(() => window.location.reload())
      })
    });
  }
}
const select = (key) => {
  selectNode.value = treeObj.value.getNodeByKey(key);
  if (selectNode.value.icon === 'folder') {
    selectFolder.value = selectNode.value.path + '/';
    content.value = '';
  } else {
    selectFile.value = selectNode.value.label;
    selectFolder.value = selectFolder.value === selectFile.value ? selectNode.value.path + '/' : selectNode.value.path.slice(0, selectNode.value.path.length - selectFile.value.length - 1);
    commandReq(6, selectNode.value.path, '').then(res => {
      content.value = res.data.message.toString();
    })
  }
}
onMounted(() => {
  commandReq(0, '', '').then(res => {
    tree(JSON.parse(res.data.message));
  })
})
const tree = (res) => {
  raw.value = res;
  transform(raw.value[0], '0', '.');
  raw.value.pop();
  final.value = raw.value;
}
const transform = (item, key, path) => {
  item.label = item.name;
  delete item.name;
  item.path = path;
  if (item.type === 'directory') {
    item.icon = 'folder';
    item.key = key;
    item.children = item.contents;
    delete item.contents;
    if (item.children) {
      item.children.forEach((child, index) => {
        transform(child, key + '-' + index, path + '/' + child.name);
      })
    }
  } else {
    item.icon = 'insert_drive_file'
    item.key = key
  }
}
// const transform = (item, key) => {
//   item.label = item.name
//   delete item.name
//   if (item.type === 'directory') {
//     item.icon = 'folder';
//     item.key = key;
//     item.children = item.contents;
//     delete item.contents;
//     if (item.children){
//     item.children.forEach((child, index) => {
//       transform(child, key + '-' + index);
//     })}
//   } else {
//     item.icon = 'insert_drive_file'
//     item.key = key
//   }
// }
//
// function key2path(tree, key) {
//
//   // 将 key 拆分为数组
//   const keyParts = key.split('-')
//
//   // 根据 key 遍历获取节点
//   let node = tree[0]
//   for (let i = 1; i < keyParts.length; i++) {
//     const index = Number(keyParts[i])
//     node = node.children[index]
//   }
//
//   // 收集路径
//   let path = node.label
//   let parent = tree[0]
//   for (let i = 1; i < keyParts.length - 1; i++) {
//     const index = Number(keyParts[i])
//     parent = parent.children[index]
//     path = parent.label + '/' + path
//   }
//
//   // 移除不需要的前缀
//   path = path.replace(/^\/root\//, '')
//
//   return path
// }


const cpmv = (n) => {
  if (n === 1) {
    copyed.value = true;
    copyfile.value = selectFolder.value + '/' + selectFile.value;
  } else {
    moved.value = true;
    movefile.value = selectFolder.value + '/' + selectFile.value;
  }
}
const paste = (n) => {
  if (n === 1) {
    commandReq(1, copyfile.value, selectFolder.value);
    copyed.value = false;

    commandReq(0, '', '').then(res => {
      tree(JSON.parse(res.data.message));
    })
  } else {
    commandReq(2, movefile.value, selectFolder.value);
    moved.value = false;

    commandReq(0, '', '').then(res => {
      tree(JSON.parse(res.data.message));
    })

  }
}
// const getNodePath = (nodes, label) => {
//   for (const node of nodes) {
//     if (node.label === label) {
//       return label
//     }
//
//     if (node.children) {
//       const childPath = getNodePath(node.children, label)
//       if (childPath) {
//         return node.label + '/' + childPath
//       }
//     }
//   }
// }


let content = ref('');
const imgAdd = (pos, file) => {
  console.log(file);
  const formData = new FormData()
  formData.append('image', file);
  axios.post('http://8.130.48.157:8081/api/upload', formData, {
    headers: {
      'Authorization': `Bearer ${$q.localStorage.getItem('token')}`,
      'content-type': 'multipart/form-data'
    }
  }).then((res) => {
    const url = `http://8.130.48.157:8081/api/file/get?filename=${res.data.message}`;
    content.value = content.value.replace(/!\[[^\]]+\]\([^)]+\)/, `![](${url})`);
  })
}

</script>

<style lang="scss" scoped>
</style>
