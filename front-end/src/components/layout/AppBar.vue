<template>
  <v-app-bar
    :elevation="3"
    scroll-off-screen="true"
    scroll-threshold="1"
    fixed
    app
  >
    <v-app-bar-title> Blog </v-app-bar-title>

    <v-btn id="home-link" @click="goToHome">Home</v-btn>

    <v-btn id="dashboard-link" @click="goToAddPost">Dashboard</v-btn>

    <v-spacer />

    <v-btn
      id="login-link"
      v-if="!isLoggedIn"
      @click="goToLogin"
      stacked
      variant="tonal"
    >
      <v-icon icon="mdi-login"></v-icon>
      Login
    </v-btn>
    <v-btn id="logout-link" v-else stacked variant="tonal" @click="logout">
      <v-icon icon="mdi-logout"></v-icon>
      Logout
    </v-btn>
  </v-app-bar>
</template>

<script>
// import store from "@/store";
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    goToLogin() {
      this.$router.push("/auth");
    },
    goToHome() {
      this.$router.push({ name: "home" });
    },
    goToAddPost() {
      this.$router.push("/add-post");
    },
    logout() {
      this.$store.dispatch("logOut");
      this.$router.push("/login");
    },
  },

  computed: {
    isLoggedIn() {
      const { isAuthenticated } = this.$store.getters;
      return isAuthenticated;
    },
  },
});
</script>
