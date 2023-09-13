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
          Flypen
        </q-toolbar-title>

        <div>c++课程设计</div>
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
  </q-layout>
</template>

<script setup lang="ts">

</script>
