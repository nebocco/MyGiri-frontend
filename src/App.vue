<template>
  <Navbar />
  <div class="router-view">
    <router-view/>
  </div>
  <Footer />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'

export default defineComponent({
  components: {
    Navbar, Footer
  }
});
</script>

<style lang="scss">
@import "assets/reset.css";

:root {
  --main-bg: #096148;
  --sub-bg: #4f726c;
  --light-bg: #f1f8f7;
  --main-tx: #2c3e50;
  --sub-tx: #545e73;
  --rev-tx: #eee;
  --blue: #0089a7;
  --red: #d0104c;
  --orange: #fc9f4d;
  --dark-orange: #d97b2a;
  --pink: #e16b8c;
  --purple: #e03c8a;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--main-tx);
  display: flex;
  flex-flow: column;
  min-height: 100vh;
}

.router-view {
  flex: 1;
  width: clamp(240px, 80%, 480px);
  margin: 0 auto;
}

input {
  box-sizing: border-box;
  padding: .4rem;
  border-radius: 0;
  border: 1px solid var(--main-bg);
  width: clamp(240px, 90%, 480px);
  margin: .4rem auto .8rem;
}

button {
  padding: .4rem .8rem;
  margin: .8rem auto;
  border: 2px solid var(--sub-bg);
  background: none;
  color: var(--sub-bg);
  min-width: 5rem;
}

</style>