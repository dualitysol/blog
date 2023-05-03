<template>
  <v-card class="mx-auto" width="344" title="User Registration">
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
          id="email"
          v-model="email"
          color="primary"
          label="Email"
          variant="outlined"
          :rules="emailRules"
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
        <v-text-field
          id="confirm-password"
          v-model="confirmedPassword"
          color="primary"
          label="Confirm Password"
          placeholder="Confirm your password"
          variant="outlined"
          :type="showPassword ? 'text' : 'password'"
          :rules="confirmRules"
        ></v-text-field>
      </v-form>
    </v-container>

    <v-divider></v-divider>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        id="register-now"
        color="success"
        variant="tonal"
        block
        @click="register"
        :disabled="!registerEnadled"
      >
        Register Now
        <v-icon icon="mdi-chevron-right" end></v-icon>
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import { defineComponent } from "vue";
import rules from "./rules";
import { register, initErrorHandler } from "@/api";

export default defineComponent({
  name: "register-form",

  data() {
    return {
      email: "",
      username: "",
      password: "",
      confirmedPassword: "",
      showPassword: false,
      registerEnadled: false,
      registerPressed: false,
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

  watch: {
    username() {
      this.validate();
    },
    email() {
      this.validate();
    },
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
      this.registerEnadled = !!this.registerPressed === false ? true : valid;
    },

    passwordsConfirmed(value = "") {
      return this.password === value;
    },
    async register() {
      try {
        this.registerPressed = true;

        await this.validate();

        if (!!this.registerEnadled === false) return;

        const { userData, token } = await register(
          this.username,
          this.email,
          this.password
        );
        const succeed = await this.$store.dispatch("authenticate", {
          user: userData,
          token,
        });

        if (succeed) {
          this.$router.push("/home");
          this.$store.dispatch("emitAlert", {
            title: "Success",
            message: "Congrats! Your registration has been successful.",
            type: "success",
            icon: "mdi-check-circle",
          });
        }
      } catch (error) {
        initErrorHandler(this, error);
      }
    },
  },
});
</script>
