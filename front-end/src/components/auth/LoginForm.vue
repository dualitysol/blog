<template>
  <v-card class="mx-auto" width="344" title="User Login">
    <v-container>
      <v-form ref="form">
        <v-text-field
          id="username"
          v-model="username"
          color="primary"
          label="Username"
          variant="outlined"
          :rules="usernameRules"
        ></v-text-field>

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
        ></v-text-field>

        <v-btn
          id="forgot-password-link"
          density="compact"
          variant="tonal"
          @click="$router.push('forgot-password')"
        >
          Forgot Password
        </v-btn>
        <v-btn
          style="margin-left: 10px"
          variant="outlined"
          density="compact"
          color="blue-darken-1"
          @click="$router.push('/registration')"
        >
          Register
        </v-btn>
      </v-form>
    </v-container>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        id="log-in"
        color="success"
        variant="tonal"
        size="large"
        block
        @click="login"
        :disabled="!loginEnadled"
      >
        Log In
        <v-icon icon="mdi-chevron-right" end></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { defineComponent } from "vue";
import rules from "./rules";
import { login, initErrorHandler } from "@/api";

export default defineComponent({
  name: "register-form",

  data() {
    return {
      username: "",
      password: "",
      showPassword: false,
      loginEnadled: false,
      loginPressed: false,
      ...rules,
    };
  },

  watch: {
    username() {
      this.validate();
    },
    password() {
      this.validate();
    },
  },

  methods: {
    async validate() {
      const { valid } = await this.$refs.form.validate();
      this.loginEnadled = !!this.loginPressed === false ? true : valid;
    },

    passwordsConfirmed(value = "") {
      return this.password === value;
    },
    async login() {
      try {
        this.loginPressed = true;

        await this.validate();

        if (!!this.loginEnadled === false) return;

        const { userData, token } = await login(this.username, this.password);
        const succeed = await this.$store.dispatch("authenticate", {
          user: userData,
          token,
        });
        if (succeed) {
          this.$router.push("/home");
        }
      } catch (error) {
        initErrorHandler(this, error);
      }
    },
  },
});
</script>
