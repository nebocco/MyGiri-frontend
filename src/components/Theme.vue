<template>
  <div class="container">
    <div class="theme-text">
      {{ theme ? theme.theme_text : "未公開" }}
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { Moment } from 'moment'; 


export interface ITheme {
  theme_id: number,
  author: string,
  theme_text: string,
  epoch_open: Moment,
}

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
.dummy {
  color: gray;
}

.theme-text {
  font-family: 'Times New Roman', Times, serif;
  font-weight: bold;
  padding: 2rem 0;
  margin: 0 auto;
  width: clamp(240px, 60%, 480px);
  border: 2px solid green;
}

.container {
  margin: .8rem 0;
}
</style>