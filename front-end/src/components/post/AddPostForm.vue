<template>
  <v-form>
    <v-card>
      <v-card-title><h2>Add New Post</h2></v-card-title>
      <v-divider></v-divider>
      <v-card-text>Type you content here</v-card-text>

      <v-container>
        <v-row>
          <v-col cols="6">
            <v-text-field
              id="title"
              v-model="title"
              label="Title"
              variant="outlined"
            />

            <v-file-input
              chips
              label="Upload  pictures"
              :prepend-icon="null"
              prepend-inner-icon="mdi-camera"
              accept="image/png, image/jpeg"
              :rules="picRules"
              variant="outlined"
              v-model="picture"
            >
            </v-file-input>
          </v-col>

          <v-col cols="6">
            <v-textarea
              id="description"
              v-model="description"
              label="Description"
            ></v-textarea>
          </v-col>
        </v-row>

        <v-textarea
          id="body"
          v-model="content"
          label="Post Content"
          variant="outlined"
        ></v-textarea>
      </v-container>

      <v-divider />

      <v-card-actions>
        <v-btn id="add-post" color="success" @click="create">Add Post</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import { defineComponent } from "vue";
import { addPost, initErrorHandler } from "@/api";

export default defineComponent({
  data() {
    return {
      title: "",
      description: "",
      content: "",
      picture: null,
      picRules: [
        (value) => {
          return (
            !value ||
            !value.length ||
            value[0].size < 2000000 ||
            "Picture size should be less than 2 MB!"
          );
        },
      ],
    };
  },

  methods: {
    async create() {
      try {
        const message = await addPost(
          this.title,
          this.description,
          this.content,
          (this.picture || [])[0]
        );

        if (message) {
          this.$router.push("/home");
          this.$store.dispatch("emitAlert", {
            title: "Success",
            message,
            type: "success",
          });
        }
      } catch (error) {
        console.error(error);
        initErrorHandler(this, error);
      }
    },
  },
});
</script>
