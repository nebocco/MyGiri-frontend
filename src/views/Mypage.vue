<template>
  <div class="about">
    <h2>詳細ページです</h2>
    <p>ログインが必要なページです</p>
    {{ userId }}
    {{ displayName }}
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