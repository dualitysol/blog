<template>
  <v-hover v-slot="{ isHovering, props }">
    <v-card
      class="mx-auto"
      max-width="1000"
      max-height="600"
      :min-height="height"
      v-bind="props"
      :elevation="isHovering ? 20 : 1"
      @click="goToPost"
    >
      <v-row>
        <v-col cols="6">
          <v-img
            class="align-end text-white"
            :height="height"
            :src="`http://localhost:3001/${media.replace(`\\`, `/`)}`"
            cover
          />
        </v-col>
        <v-col cols="6">
          <v-card-title>
            <span class="text-h4">{{ title }}</span>
          </v-card-title>
          <v-card-subtitle class="pt-4 text-subtitle-1">{{
            new Date(createdAt)
          }}</v-card-subtitle>

          <v-card-text>
            <span class="text-h6">{{ description }}</span>
          </v-card-text>

          <v-card-actions style="margin-bottom: 20px">
            <v-btn
              id="blog-listing-link"
              variant="elevated"
              color="blue"
              rounded="lg"
              size="large"
              @click="goToPost"
            >
              Read
            </v-btn>
          </v-card-actions>
        </v-col>
      </v-row>
    </v-card>
  </v-hover>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    id: Number,
    title: String,
    description: String,
    media: String,
    createdAt: String,
  },

  methods: {
    goToPost() {
      this.$router.push(`/blog-details/${this.id}`);
    },
  },

  computed: {
    height() {
      return this.media !== "0" ? 450 : 200;
    },
  },
});
</script>
