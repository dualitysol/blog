<template>
  <div>
    <transition name="slide-fade" appear>
      <v-alert
        :id="`${type}-alert`"
        v-if="show"
        :color="type"
        :type="type"
        closable="true"
        max-width="1024"
        :title="title"
        :icon="icon || ''"
      >
        <text id="alert-content">
          {{ text }}
        </text>
      </v-alert>
    </transition>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: ["title", "text", "icon", "type"],
  data() {
    return {
      show: false,
    };
  },

  mounted() {
    this.show = true;
    setTimeout(() => {
      this.show = false;
    }, 3500);
  },
});
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
