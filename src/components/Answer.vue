<template>
  <div class="container">
    <Theme :theme="theme" />
    <h3>{{ answer.answer_text }}</h3>
    <div class="score">
      <span>
        <i
          class="fa-heart"
          :class="answer.voted ? 'fa' : 'far'"
        />
        {{ Math.floor(answer.score / 100000)}}
        <i class="fa fa-star"/>
        {{ Math.floor(answer.score % 100000)}}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue';
import { IAnswer, ITheme } from '@/types';
import Theme from '@/components/Theme.vue'

export default defineComponent({
  name: "Answer",
  props: {
    theme: {
      type: Object as PropType<ITheme>,
      required: true
    },
    answer: {
      type: Object as PropType<IAnswer>,
      required: true
    }
  },
  components: {
    Theme
  }
})
</script>

<style lang="scss" scoped>
.container {
  margin: .8rem 0;
  cursor: default;
}

h3 {
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 120%;
  cursor: default;
  margin: .4rem 0;
}

h3, .score {
  padding: 0 1.2rem;
}

i {
  &.fa-heart {
    color: var(--pink);
  }

  &.fa-star {
    color: var(--orange);
  }
}
</style>