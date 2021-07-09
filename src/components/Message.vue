<template>
  <div class="container" v-if="message">
    <p class="main">{{ message }}</p>
    <p class="sub" v-if="sub">{{ sub }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "Message",
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

<style lang="scss" scoped>

.container {
  box-sizing: border-box;
  width: 90%;
  margin: .8rem auto;
  padding: .8rem;
  border: 2px solid var(--blue);
  color: var(--blue);
  border-radius: .4rem;
  background: rgb(233, 232, 250);
  
  p {
    text-align: center;
  }
  
  &.error {
    border-color: var(--red);
    color: var(--red);
    background: rgb(250, 232, 235);
  }
}



.sub {
  margin-top: .4rem;
  font-size: .8rem;
}

</style>