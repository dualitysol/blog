<template>
  <v-container>
    <v-form>
      <forgot-password />
    </v-form>
  </v-container>
</template>

<script>
import ForgotPassword from "../components/auth/ForgotPassword.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    ForgotPassword,
  },
});
</script>
