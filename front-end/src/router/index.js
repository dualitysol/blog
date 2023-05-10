import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import store from "@/store";

const routes = [
  {
    path: "/home",
    name: "home",
    alias: "/",
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
  {
    path: "/forgot-password",
    name: "forgot-password",
    component: () => import("../views/ForgotPassword.vue"),
  },
  {
    path: "/profile/:profileId",
    name: "profile-page",
    component: () => import("../views/ProfileView.vue"),
  },
  {
    path: "/my-profile",
    name: "my-profile",
    component: () => import("../views/ProfileView.vue"),
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: () => import("../views/ResetPassword.vue"),
  },
  {
    path: "/add-new-post",
    name: "add-new-post",
    component: () => import("../views/AddPostView.vue"),
  },
  {
    path: "/blog-details/:postId",
    name: "blog-details",
    component: () => import("../views/PostView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = store.getters;
  const toLogin = to.path === "/login";
  const toRegister = to.path === "/registration";
  const toRestorePassword = to.path === "/forgot-password";
  const toResetPassword = to.path === "/reset-password";
  const toAuth = toLogin || toRegister || toRestorePassword || toResetPassword;

  if (toAuth) return next();

  if (!isAuthenticated) {
    const alert = {
      type: "error",
      title: "Access Error",
      message: "You must be logged in first!",
    };

    store.dispatch("emitAlert", alert);

    next({ name: "signin" });
  } else next();
});

export default router;
