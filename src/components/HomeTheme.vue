<template>
  <div class="container">
    <p v-if="state === 'Dummy'">dummy</p>
    <p v-else-if="state === 'Unpublished'">未公開</p>
    <p v-if="state === 'Accepting'">投稿</p>
    <p v-if="state === 'Voting'">投票</p>
    <p v-if="state === 'Closed'">結果</p>
    <Theme :theme="theme">
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import moment, { Moment } from 'moment'; 
import { ITheme } from '@/components/Theme.vue';

export default defineComponent({
  name: "Theme",
  props: {
    theme: {
      type: Object as PropType<ITheme>,
    },
    today: {
      type: Object as PropType<Moment>,
    },
  },
  computed: {
    epoch_open(): Moment | undefined {
      return this.theme ? moment(this.theme.epoch_open) : undefined;
    },
    state(): string {
      return this.theme && this.today ?
        this.today < this.epoch_open! ? "Unpublished" :
        this.today < this.epoch_open!.add(24, 'hours') ? "Accepting" :
        this.today < this.epoch_open!.add(24 + 8, 'hours') ? "Voting" : "Closed" :
        "Dummy"
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