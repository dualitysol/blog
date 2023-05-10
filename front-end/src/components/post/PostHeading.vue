<template>
  <div>
    <span class="text-h2 font-weight-bold">{{ title }}</span>
    <br />
    <v-spacer />
    <br />
    <span class="text-h6" style="color: #01579b">{{
      new Date(createdAt)
    }}</span>
    <br />
    <v-spacer />
    <br />
    <span class="text-h6" style="color: grey">{{ description }}</span>
    <br />
    <v-spacer />
    <br />
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    title: String,
    description: String,
    createdAt: String,
  },
});
</script>
