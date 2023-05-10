<template>
  <v-container>
    <v-row align="center" justify="center">
      <v-col align="center" xxl="6" xl="6" l="8" md="10" sm="12" xs="12">
        <add-post-form />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";
import AddPostForm from "@/components/post/AddPostForm.vue";

export default defineComponent({
  components: {
    AddPostForm,
  },
});
</script>
