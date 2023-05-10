<template>
  <v-row>
    <v-col>
      <v-row style="margin-top: 30px; margin-bottom: 30px">
        <v-divider />
        <span style="margin-top: 30px" class="text-h4">Comments section</span>
      </v-row>

      <comment-input :postId="postId" />

      <v-row
        v-for="comment in comments"
        v-bind:key="comment.id"
        style="margin-bottom: 10px"
      >
        <comment-banner :name="comment.name" :message="comment.message" />
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
import { defineComponent } from "vue";
import CommentBanner from "@/components/comment/CommentBanner.vue";
import CommentInput from "./CommentInput.vue";
import { initErrorHandler, getComments } from "@/api";

export default defineComponent({
  props: { postId: Number },

  components: {
    CommentBanner,
    CommentInput,
  },

  data() {
    return {
      comments: [],
    };
  },

  mounted() {
    this.loadComments();
  },

  methods: {
    async loadComments() {
      try {
        const comments = await getComments(this.postId);
        console.log("COOOM", comments);
        this.comments = comments;
      } catch (error) {
        initErrorHandler(this, error);
      }
    },
  },
});
</script>
