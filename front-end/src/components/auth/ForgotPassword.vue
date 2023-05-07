<template>
  <v-card class="mx-auto" width="344" title="User Login">
    <v-container>
      <v-form ref="form">
        <v-text-field
          id="email"
          v-model="email"
          color="primary"
          label="Email"
          variant="outlined"
          :rules="emailRules"
        >
        </v-text-field>
      </v-form>
    </v-container>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        id="submit"
        color="success"
        variant="tonal"
        block
        @click="forgotPassword"
      >
        Submit
        <v-icon icon="mdi-chevron-right" end></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { defineComponent } from "vue";
import { emailRules } from "./rules";
import { forgotPassword, initErrorHandler } from "@/api";

export default defineComponent({
  name: "register-form",

  data() {
    return {
      email: "",
      emailRules,
    };
  },

  methods: {
    async forgotPassword() {
      try {
        if (!!this.email === false) return;

        const message = await forgotPassword(this.email);

        this.$store.dispatch("emitAlert", {
          title: "Success",
          message,
          type: "success",
        });
        this.$router.push("/forgot-password");
      } catch (error) {
        initErrorHandler(this, error);
      }
    },
  },
});
</script>
