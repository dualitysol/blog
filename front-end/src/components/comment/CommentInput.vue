<template>
  <v-form ref="form">
    <v-row>
      <v-col cols="9">
        <v-textarea
          id="message"
          v-model="message"
          label="Type Here Your Comment"
        />
      </v-col>
      <v-col cols="3">
        <v-text-field id="name" v-model="name" label="Name" />
        <v-btn
          id="add-comment"
          color="info"
          block
          size="x-large"
          rounded="0"
          @click="addComment"
        >
          Add Comment
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { defineComponent } from "vue";
import { initErrorHandler, createComment } from "@/api";

export default defineComponent({
  props: { postId: Number },

  data() {
    return {
      message: "",
      name: "",
      nameRules: [
        (value) => {
          if (value) return true;

          return "The name is required and cannot be empty";
        },
      ],
      messageRules: [
        (value) => {
          if (value) return true;

          return "The message is required and cannot be empty";
        },
      ],
    };
  },

  methods: {
    async addComment() {
      try {
        const { valid } = await this.$refs.form.validate();

        if (!valid) return;

        const message = await createComment(
          this.postId,
          this.name,
          this.message
        );
        const alert = { type: "success", title: "Success", message };

        this.$router.push("/home");
        this.$store.dispatch("emitAlert", alert);
      } catch (error) {
        console.log("ERRRRRRR", error);
        initErrorHandler(this, error);
      }
    },
  },
});
</script>
