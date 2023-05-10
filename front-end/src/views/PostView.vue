<template>
  <v-container>
    <v-row justify="center">
      <v-col xl="8" l="10" md="12">
        <v-row>
          <profile-card :profile="author || {}" />
        </v-row>

        <v-row>
          <v-img
            max-height="1500"
            max-width="2000"
            :src="`http://localhost:3001/${media.replace(`\\`, `/`)}`"
            cover
          />
        </v-row>

        <v-row style="margin-top: 40px">
          <post-heading
            :title="title"
            :createdAt="createdAt"
            :description="description"
          />
        </v-row>

        <v-row>
          <post-content>{{ content }}</post-content>
        </v-row>

        <comment-section :postId="id" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";
import { getPost, initErrorHandler } from "@/api";
import ProfileCard from "@/components/profile/ProfileCard.vue";
import PostHeading from "@/components/post/PostHeading.vue";
import PostContent from "@/components/post/PostContent.vue";
import CommentSection from "@/components/comment/CommentSection.vue";

export default defineComponent({
  components: {
    ProfileCard,
    PostHeading,
    PostContent,
    CommentSection,
  },

  data() {
    return {
      id: "",
      title: "",
      description: "",
      content: "",
      media: "",
      createdAt: "",
      author: {},
    };
  },

  methods: {
    async loadPost() {
      try {
        const { title, description, media, content, createdAt, author } =
          await getPost(this.id);

        this.title = title;
        this.description = description;
        this.media = media;
        this.content = content;
        this.createdAt = createdAt;
        this.author = author;
      } catch (error) {
        console.error("ERR", error);
        initErrorHandler(this, error);
      }
    },
  },

  beforeMount() {
    this.id = this.$router.currentRoute.value.params.postId;
  },

  mounted() {
    this.loadPost();
  },
});
</script>
