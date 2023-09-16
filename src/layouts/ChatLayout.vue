<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
        />

        <q-toolbar-title>
          {{route.params.id}}
        </q-toolbar-title>

        <div>C++ Course Design</div>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      bordered
    >
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout></template>

<script setup lang="ts">
import {useRoute} from 'vue-router'
const route = useRoute();
</script>

<style scoped lang="scss">

</style>
