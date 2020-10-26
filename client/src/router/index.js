import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/home.vue";
import Chat from "../views/chat.vue";
import ChatAdmin from "../views/chatAdmin.vue";
import getSocket from '../helpers/socket';

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/login.vue"),

  },
  {
    path: "/register",
    name: "register",
    component: () => import("../views/register.vue")
  },
  {
    path: "/chat/player1",
    name: "chatAdmin",
    component: ChatAdmin,
    meta: {
        requiresAuth: true
      }
  },
  {
    path: "/chat",
    name: "chat",
    component: Chat,
    meta: {
        requiresAuth: true
      },
    
  }
];

const router = new VueRouter({
  mode: "history",
//base: process.env.VUE_APP_API_ROOT,
  routes
});

const socket = getSocket()
router.beforeEach((to, from, next) => {

  if (to.name === from.name) {
    return next()
  }
  if (socket.io.readyState === 'open') {
    if (to.name) {
      console.log(to.name)
      socket.emit('join', to.name)
    }
  }
  next()
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem("user") == null) {
      next({
        path: "/login"
      });
    } else {
      next();
    }
  } else {
    next()
  
  }
});

export default router;