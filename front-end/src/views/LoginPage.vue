<template>
  <v-container>
    <v-form>
      <login-form />
    </v-form>
  </v-container>
</template>

<script>
import LoginForm from "../components/auth/LoginForm.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    LoginForm,
  },
});
</script>
