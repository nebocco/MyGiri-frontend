<template>
  <div class="about">
    <h2>詳細ページです</h2>
    <p>ログインが必要なページです</p>
    {{ userId }}
    {{ userName }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store';

export default defineComponent({
  data() {
    return {
      userId: "",
      userName: ""
    }
  }, 
  mounted() {
    this.userId = store.getters.userId;
    this.userName = store.getters.userName;
  }
});
</script>