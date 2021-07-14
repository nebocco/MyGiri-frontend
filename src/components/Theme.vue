<template>
  <div class="container">
    <div class="theme-text">
      <p>{{ theme ? theme.theme_text : "？？？" }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { ITheme } from '@/types'

export default defineComponent({
  name: "Theme",
  props: {
    theme: {
      type: Object as PropType<ITheme>,
    }
  }
})
</script>

<style lang="scss" scoped>
.theme-text {
  box-sizing: border-box;
  font-family: 'Sawarabi Mincho', "YuMincho", "Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", 'Times New Roman', serif;
  font-weight: bold;
  display: flex;
  font-size: 1.2em;
  padding: 1.2rem;
  margin: 0 auto;
  height: auto;
  min-height: 6rem;
  width: clamp(240px, 90%, 960px);
  border: 2px solid var(--sub-bg);
  justify-content: center;
  align-items: center;
  line-height: 120%;
}

.container {
  margin: .8rem 0;
  cursor: default;
}
</style>