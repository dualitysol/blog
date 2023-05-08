<template>
  <v-container class="text-center">
    <v-row align-content="cetner" justify="center">
      <v-card class="profile-info" style="max-width: 1000px; min-width: 800px">
        <v-card-title>
          <span class="text-h2" id="heading">{{
            isMy ? "Your Profile" : "Profile"
          }}</span>
        </v-card-title>

        <v-divider></v-divider>

        <v-row
          align-content="top"
          justify="cetner"
          style="margin-top: 35px; margin-bottom: 35px"
        >
          <profile-form
            v-model="profile"
            :editable="isMy ? true : false"
            @save="save"
          />
        </v-row>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";
import { getProfileById, initErrorHandler, saveProfileInfo } from "@/api";
import ProfileForm from "@/components/profile/ProfileForm.vue";

export default defineComponent({
  components: {
    ProfileForm,
  },

  data() {
    return {
      isMy: false,
      profile: {
        id: "",
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        address: "",
        website: "",
        gender: "",
        age: null,
      },
    };
  },

  methods: {
    async save() {
      try {
        const message = await saveProfileInfo(this.profile.id, this.profile);
        const alert = { type: "success", title: "Successfull", message };

        this.$router.push("/home");
        this.$store.dispatch("emitAlert", alert);
      } catch (error) {
        console.log(error);
        initErrorHandler(this, error);
      }
    },

    async loadProfile() {
      try {
        const { profileId } = this.$router.currentRoute.value.params;
        const profile = await getProfileById(
          profileId || this.$store.getters.userData.id
        );

        this.profile = profile;
        this.isMy =
          parseInt(this.$store.getters.userData.id) === parseInt(profile.id);
      } catch (error) {
        initErrorHandler(this, error);
      }
    },
  },
  mounted() {
    this.loadProfile();
  },
});
</script>
