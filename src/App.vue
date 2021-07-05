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

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.router-view {
  width: 80%;
  margin: 0 auto;
}
</style>
