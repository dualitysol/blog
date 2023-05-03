<template>
  <v-app>
    <v-main>
      <alerts-block
        style="margin-bottom: 25px; position: absolute; z-index: 1"
      />
      <app-bar />

      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import AppBar from "./components/layout/AppBar.vue";
import AlertsBlock from "./components/notifications/AlertsBlock.vue";
import { defineComponent } from "vue";

export default defineComponent({
  name: "App",

  data: () => ({
    authOverlay: false,
  }),

  components: {
    AppBar,
    AlertsBlock,
  },
});
</script>
