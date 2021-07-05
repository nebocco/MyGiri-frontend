<template>
  <div class="container">
    <p>送信完了しました</p>
    <router-link to="/">ホームへ</router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: "Done"
})
</script>

<style lang="scss" scoped>
a {
  box-sizing: border-box;
  text-decoration: none;
  border-bottom: 1px solid green;
  padding: .4rem;
  margin: 2rem;
}
</style>