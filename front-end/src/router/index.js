import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import store from "@/store";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/registration",
    name: "signup",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/RegisterPage.vue"),
  },
  {
    path: "/login",
    name: "signin",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/LoginPage.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to) => {
  const { isAuthenticated } = store.getters;
  const toLogin = to.name === "signin";
  const toRegister = to.name === "signup";
  const toAuth = toLogin || toRegister;

  if (!isAuthenticated && !toAuth) {
    const alert = {
      type: "error",
      title: "Access Error",
      message: "You must be logged in first!",
    };

    store.dispatch("emitAlert", alert);

    return { name: "signin" };
  }
});

export default router;
