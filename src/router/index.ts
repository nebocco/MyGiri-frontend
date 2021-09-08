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
    path: '/mypage',
    name: 'Mypage',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '@/views/Mypage.vue'),
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
    path: '/done',
    name: 'Done',
    component: () => import('@/views/Done.vue'),
    props: true,
  },
  {
    path: '/theme/:id',
    name: 'ThemeDetail',
    component: () => import('@/views/ThemeDetail.vue'),
  },
  {
    path: '/user/:user_id',
    name: 'User',
    component: () => import('@/views/User.vue'),
    meta: {
      isPrivate: true
    }
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('@/views/Terms.vue'),
  },
  {
    path: '/policy',
    name: 'Policy',
    component: () => import('@/views/Policy.vue'),
  },
  {
    path: '/rules',
    name: 'Rules',
    component: () => import('@/views/Rules.vue'),
  },
  {
    path: '/:date',
    name: 'DailyHome',
    component: () => import('@/views/DailyHome.vue'),
    meta: { }
  },
  {
    path: "/:catchAll(.*)",
    redirect: '/'
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  store.state.rememberRoot = from.path;
  if (to.matched.some(page => page.meta.isPrivate) && !store.getters.isLoggedIn) {
    store.state.rememberRoot = to.path;
    next('/login')
  } else if (to.matched.some(page => page.meta.forGuest) && store.getters.isLoggedIn) {
    next('/')
  } else if (to.matched.some(page => page.name?.toString() == "Done") &&
    from.name?.toString() !== "ThemeDetail"
  ) {
    next('/')
  } else {
    next()
  }
})

export default router
