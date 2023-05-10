<template>
  <v-banner border>
    <template v-slot:prepend>
      <v-col>
        <v-row justify="center">
          <v-avatar size="60">
            <v-icon icon="mdi-account-circle" size="x-large" color="info" />
          </v-avatar>
        </v-row>
        <v-row>
          <span class="text-h6">{{ name }}</span>
        </v-row>
      </v-col>
    </template>

    <v-banner-text>
      <span class="text-h6 text-button">
        {{ message }}
      </span>
    </v-banner-text>
  </v-banner>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    name: String,
    message: String,
  },
});
</script>
