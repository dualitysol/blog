<template>
  <v-card max-width="400" style="margin-bottom: 15px; margin-top: 15px">
    <v-card-title>
      <v-row align="center">
        <v-col cols="2">
          <v-avatar>
            <v-icon icon="mdi-account-circle-outline"></v-icon>
          </v-avatar>
        </v-col>
        <v-col cols="10">
          <v-row align="center">
            <span class="text-h5">
              {{
                (profile.firstName || profile.username) + " " + profile.lastName
              }}
            </span>
            <v-btn
              style="margin-left: 10px"
              variant="tonal"
              color="light-blue-lighten-3"
              @click="goToProfile(profile.id)"
            >
              View Profile
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-card-title>
  </v-card>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    profile: Object,
    default: {},
  },

  methods: {
    goToProfile() {
      this.$router.push("/profile/" + this.profile.id);
    },
  },
});
</script>
