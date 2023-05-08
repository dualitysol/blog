<template>
  <v-container>
    <v-form>
      <v-row>
        <v-col cols="6">
          <v-text-field
            id="user-name"
            label="Username"
            variant="outlined"
            v-model="profile.username"
            readonly
          />
          <v-text-field
            id="email"
            label="Email"
            variant="outlined"
            v-model="profile.email"
            disabled
          />
          <v-text-field
            @change="this.saveEnabled = true"
            id="firstname"
            label="First Name"
            variant="outlined"
            v-model="profile.firstName"
            :readonly="!editable"
          />
          <v-text-field
            @change="this.saveEnabled = true"
            id="lastname"
            label="Last Name"
            variant="outlined"
            v-model="profile.lastName"
            :readonly="!editable"
          />
          <v-btn
            class="col-elem"
            :disabled="false"
            variant="tonal"
            color="blue"
            block
          >
            View All Posts: 23
          </v-btn>
        </v-col>
        <v-col cols="6">
          <v-text-field
            @change="this.saveEnabled = true"
            id="age"
            label="Age"
            variant="outlined"
            v-model="profile.age"
            :readonly="!editable"
            :rules="ageRules"
          />
          <v-text-field
            @change="this.saveEnabled = true"
            id="gender"
            label="Gender"
            v-model="profile.gender"
            variant="outlined"
            :readonly="!editable"
          ></v-text-field>
          <v-text-field
            @change="this.saveEnabled = true"
            id="address"
            label="Address"
            variant="outlined"
            v-model="profile.address"
            :readonly="!editable"
          />
          <v-text-field
            @change="this.saveEnabled = true"
            id="website"
            label="Website"
            variant="outlined"
            v-model="profile.website"
            :readonly="!editable"
          />
          <v-btn
            id="update-profile"
            :disabled="!this.saveEnabled"
            class="col-elem"
            v-if="editable"
            variant="tonal"
            color="success"
            block
            @click="save"
          >
            Update Profile
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    modelValue: Object,
    editable: Boolean,
  },

  emits: ["update:modelValue"],

  data() {
    return {
      saveEnabled: false,
      profile: {
        username: this.modelValue.username,
        email: this.modelValue.email,
        firstName: this.modelValue.firstName,
        lastName: this.modelValue.lastName,
        age: this.modelValue.age,
        gender: this.modelValue.gender,
        address: this.modelValue.address,
        website: this.modelValue.website,
      },
      ageRules: [
        (value) =>
          Number.isInteger(parseInt(value)) || "Age could be only a number",
      ],
    };
  },

  watch: {
    modelValue() {
      this.profile = this.modelValue;
    },
  },

  methods: {
    save() {
      this.$emit("update:modelValue", this.profile);
      this.$emit("save");
    },
  },
});
</script>

<style scoped>
.v-text-field {
  max-width: 400px;
  margin-left: 15px;
  margin-right: 15px;
}
</style>
