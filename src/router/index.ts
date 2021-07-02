import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/views/Home.vue';
import store from '@/store';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/About.vue'),
    meta: {
      isPrivate: true
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: {
      forGuest: true,
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/Register.vue'),
    meta: {
      forGuest: true,
    }
  },
  {
    path: '/theme/:id',
    name: 'ThemeDetail',
    component: () => import('@/views/ThemeDetail.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, _from, next) => {
  if (to.matched.some(page => page.meta.isPrivate) && !store.getters.isLoggedIn) {
    next('/login')
  } else if (to.matched.some(page => page.meta.forGuest) && store.getters.isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
