import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import UserProfile from '../components/UserProfile.vue';
import Genetare from '@/components/Genetare.vue';
import Manager from '@/components/Manager.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/user-profile', component: UserProfile, meta: { requiresAuth: true } },
  { path: '/generate', component: Genetare, meta: { requiresAuth: true } },
  { path: '/manager', component: Manager, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({ path: '/login' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;