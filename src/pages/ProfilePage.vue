<template>
  <q-btn style="position: fixed;z-index: 100001;top: 0;left: 0" round flat @click="router.go(-1)"><q-icon color="white" name="arrow_back"></q-icon></q-btn>
  <q-btn style="position: fixed;z-index: 100001;top: 0;right: 0" round flat>
    <q-icon name="more_vert" color="white"></q-icon>
    <q-menu style="position: fixed;z-index: 100002;top: 0;">
      <q-list style="min-width: 100px">
        <q-item clickable v-close-popup @click="delFriend()">
          <q-item-section>Delete Friends</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
  <div class="avatar">
    <div class="img-container">
    <img style="width: 100vw" :src="getAvatar()" alt="">
    </div>
    <div class="username text-h4">{{route.params.id}}</div>
    <div class="q-ml-md" style="margin-top: -2rem">
    <div class="text-primary text-bold">Account</div>
    <div class="q-mt-sm text-h6"><q-icon name="alternate_email"></q-icon> {{route.params.id}}</div>
    <div class="text-grey q-mb-sm">Username</div>
    <q-separator/>
      <div class="q-mt-sm text-h6"><q-icon name="calendar_month"></q-icon> {{getTime()}}</div>
      <div class="text-grey q-mb-sm">Register Time</div>
    </div>
    <q-separator/>
  </div>
</template>
<script setup>
import {date, useQuasar} from 'quasar';
import {useCheckStore} from 'stores/check';
import {useRoute, useRouter} from 'vue-router';
import Swal from 'sweetalert2';
import axios from 'axios';

const $q = useQuasar();
const store = useCheckStore();
const router = useRouter()
const route = useRoute();
const getTime=()=>{
  let timeStamp;
  if(store.info.username===route.params.id) timeStamp = new Date(store.info.registerTime);
  else timeStamp = new Date(store.info.friends.find(item => item.username === route.params.id).registerTime);
  return date.formatDate(timeStamp, 'MMMM YYYY');
}
const getAvatar=()=>{
  if(store.info.username===route.params.id){
    return store.avatar(store.info.avatar)
  }else
    return store.avatar(store.info.friends.find(item => item.username === route.params.id).avatar);
}
const token = $q.localStorage.getItem('token')
const delFriend=()=>{
  Swal.fire({title:'Are you sure to delete this friend?',text:'You will not be able to recover this friend!',icon:'warning',showCancelButton:true,reverseButtons:true}).then((res)=>{
    if(res.isConfirmed) {
      axios.post(`http://8.130.101.128:8081/api/newfriends?operation=delete&username=${route.params.id}`,'',{headers:{Authorization:`Bearer ${token}`}}).then((res)=>{
        if(res.data.code===200){
          Swal.fire('Deleted!','Your friend has been deleted.','success').then(()=>{
            router.push('/chat')
          })
        }
      }).catch(()=>{
        Swal.fire('Oops...','Something went wrong!','error')
      })
    }
  })
}
</script>
<style scoped lang="scss">
.avatar{
  position: absolute;
  top:0;
  z-index: 100000;
  .img-container {
    position: relative;

    img {
      display: block;
    }

    &:before,
    &:after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      height: 25%;
    }

    &:before {
      top: 0;
      background: linear-gradient(to bottom, rgba(0,0,0,0.5), rgba(0,0,0,0));
    }

    &:after {
      bottom: 0;
      background: linear-gradient(to top, rgba(0,0,0,0.5), rgba(0,0,0,0));
    }
  }
  .username{
    position: relative;
    top: -4rem;
    color:white;
    text-shadow: 3px 3px 2px rgba(127, 127, 127, 0.33);;
    padding: 0 1em;
  }
}

</style>
