<template>
  <div class="answer-container">
    <Theme :theme="theme" />
    <h3>{{ answer.answer_text }}</h3>
    <div class="score">
      <span>
        <i class="far fa-heart"/>
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
.answer-container {
  margin: .8rem 0;
  cursor: default;
  // padding: .4rem 0;
}

h3 {
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 120%;
  cursor: default;
  width: clamp(240px,90%,960px);
  margin: 1.2rem auto .8rem;
}

.score {
  width: clamp(240px,90%,960px);
  margin: 0 auto;
  text-align: left;
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