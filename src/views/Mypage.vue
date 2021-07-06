<template>
  <div class="about">
    <p>ユーザーID: {{ userId }}</p>
    <p>ニックネーム: {{ displayName }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';

export default defineComponent({
  data() {
    return {
      userId: "",
      displayName: ""
    }
  }, 
  mounted() {
    this.userId = store.getters.userId;
    this.displayName = store.getters.displayName;
  }
});
</script>