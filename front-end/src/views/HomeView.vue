<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="10">
        <span class="text-h4">Blog Listing</span>

        <v-container
          id="blog-listing"
          v-for="post in posts"
          v-bind:key="post.id"
        >
          <post-card
            :id="post.id"
            :title="post.title"
            :description="post.description"
            :media="post.media"
            :createdAt="post.createdAt"
          />
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";
import PostCard from "@/components/post/PostCard.vue";
import { getPosts, initErrorHandler } from "@/api";

export default defineComponent({
  name: "HomeView",

  components: {
    PostCard,
  },

  data() {
    return {
      posts: [],
    };
  },

  methods: {
    async getPosts() {
      try {
        const posts = await getPosts();
        this.posts = posts;
      } catch (error) {
        initErrorHandler(this, error);
      }
    },
  },

  mounted() {
    this.getPosts();
  },
});
</script>
<style scoped>
.exs {
  margin-bottom: 20px;
}
</style>
