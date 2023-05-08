<template>
  <v-card class="mx-auto" width="344" title="Reset Password">
    <v-container>
      <v-form ref="form">
        <v-text-field
          id="password"
          v-model="password"
          color="primary"
          label="Password"
          placeholder="Enter your password"
          variant="outlined"
          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
          :type="showPassword ? 'text' : 'password'"
          @click:append-inner="showPassword = !showPassword"
          :rules="passwordRules"
        />
        <v-text-field
          id="confirm-password"
          v-model="confirmedPassword"
          color="primary"
          label="Confirm Password"
          placeholder="Confirm your password"
          variant="outlined"
          :type="showPassword ? 'text' : 'password'"
          :rules="confirmRules"
        />
      </v-form>
    </v-container>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        id="reset-password"
        color="success"
        variant="tonal"
        block
        @click="reset"
        :disabled="!resetEnabled"
      >
        Reset
        <v-icon icon="mdi-chevron-right" end></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { defineComponent } from "vue";
import rules from "./rules";
import { setToken, resetPassword, initErrorHandler } from "@/api";

export default defineComponent({
  name: "register-form",

  data() {
    return {
      password: "",
      confirmedPassword: "",
      showPassword: false,
      resetEnabled: false,
      resetPressed: false,
      ...rules,
      confirmRules: [
        (value = "") =>
          !!value || "The confirm password is required and cannot be empty",
        (value = "") => {
          return (
            this.passwordsConfirmed(value) ||
            "The password and its confirm are not the same"
          );
        },
      ],
    };
  },

  beforeMount() {
    const { token } = this.$route.query;
    setToken(token);
  },

  watch: {
    password() {
      this.validate();
    },
    confirmedPassword() {
      this.validate();
    },
  },

  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate();
      this.resetEnabled = !!this.resetPressed === false ? true : valid;
    },

    passwordsConfirmed(value = "") {
      return this.password === value;
    },
    async reset() {
      try {
        this.resetPressed = true;

        await this.validate();

        if (!!this.resetEnabled === false) return;

        const succeed = await resetPassword(this.password);

        if (succeed) {
          this.$router.push("/login");
          this.$store.dispatch("emitAlert", {
            title: "Success",
            message: "Congrats! Your password has been reset.",
            type: "success",
            icon: "mdi-check-circle",
          });
        }
      } catch (error) {
        this.$router.push("/forgot-password");
        initErrorHandler(this, error);
      }
    },
  },
});
</script>
