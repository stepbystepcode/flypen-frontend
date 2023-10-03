import { RouteRecordRaw } from 'vue-router';
import ListPage from 'pages/ListPage.vue';
import ChatPage from 'pages/ChatPage.vue';
const routes: RouteRecordRaw[] = [
  {
    path: '/file',
    component: () => import('layouts/ChatLayout.vue'),
    children: [
    { path: '/file/explorer', component: () => import('pages/EditorPage.vue') }]
  },
  {
    path: '/chat',
    component: () => import('layouts/ChatLayout.vue'),
    children: [{ path: '/chat', component: () => import('pages/ListPage.vue') },
    { path: '/chat/person/:id', components: {fakeSidebar:ListPage,default:ChatPage} },
    { path: '/chat/newfriends', component: () => import('pages/NewFriends.vue') }]
  },
  {
    path: '/',
    component: () => import('layouts/ChatLayout.vue'),
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
