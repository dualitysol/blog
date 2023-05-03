import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import { loadFonts } from "./plugins/webfontloader";

loadFonts();

const app = createApp(App);

if (window.Cypress) {
  //@ts-ignore
  window.$store = store;
  //@ts-ignore
  window.app = app.config.globalProperties;
}

app.use(router).use(store).use(vuetify).mount("#app");
