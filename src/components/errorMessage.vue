<template>
  <div class="container" v-if="message">
    <p class="main">{{ message }}</p>
    <p class="sub" v-if="sub">{{ sub }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "errorMessage",
  props: {
    message: {
      type: String
    },
    sub: {
      type: String,
    }
  }
});
</script>