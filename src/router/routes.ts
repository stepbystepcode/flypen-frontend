import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/file',
    component: () => import('layouts/FileLayout.vue'),
    children: [{ path: '/file/editor', component: () => import('pages/EditorPage.vue') },{ path: '/file/explorer', component: () => import('pages/FilePage.vue') }]
  },
  {
    path: '/chat',
    component: () => import('layouts/ChatLayout.vue'),
    children: [{ path: '/chat', component: () => import('pages/ListPage.vue') },
    { path: '/chat/person/:id', component: () => import('pages/ChatPage.vue') },
    { path: '/chat/newfriends', component: () => import('pages/NewFriends.vue') }]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '/', component: () => import('pages/IndexPage.vue') },
    { path: '/signup', component: () => import('pages/SignupPage.vue') },
    { path: '/avatar', component: () => import('pages/AvatarPage.vue') },
    { path: '/login', component: () => import('pages/LoginPage.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
