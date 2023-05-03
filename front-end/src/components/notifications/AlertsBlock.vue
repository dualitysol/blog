<template>
  <v-col>
    <v-container v-for="alert in handleAlerts" v-bind:key="alert.timestamp">
      <transition-group name="list">
        <v-row align-self="center" justify="center" style="margin-top: 20px">
          <alert-component
            :title="alert.title"
            :text="alert.message"
            :type="alert.type"
            :icon="alert.icon"
          >
          </alert-component>
        </v-row>
      </transition-group>
    </v-container>
  </v-col>
</template>

<script>
import AlertComponent from "./AlertComponent.vue";
import { defineComponent } from "vue";

export default defineComponent({
  components: {
    AlertComponent,
  },

  computed: {
    handleAlerts() {
      return this.$store.getters.actualAlerts;
    },
  },
});
</script>

<style scoped>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>
