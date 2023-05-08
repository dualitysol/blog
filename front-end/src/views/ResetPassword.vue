<template>
  <v-container>
    <v-form>
      <reset-password />
    </v-form>
  </v-container>
</template>

<script>
import ResetPassword from "../components/auth/ResetPassword.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    ResetPassword,
  },
});
</script>
