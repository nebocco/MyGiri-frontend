<template>
  <div class="container">
    {{ theme_id ?? 'a' }}
    <ul>
      <li 
        v-for="answer, i in answers"
        :key="i"
      >
        <p>
          {{ answer.answer_text }}
          {{ answer.score }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IAnswer, IAnswerBefore } from '@/components/Vote.vue'
import store from '@/store'
import { AxiosResponse } from 'axios'
import moment from 'moment'


export default defineComponent({
  name: "Result",
  data() {
    return {
      answers: [] as IAnswer[]
    }
  },
  mounted() {
    store.dispatch('request', {
      method: "GET",
      url: `/theme/${this.theme_id}/result`
    }).then((response: AxiosResponse) => {
      console.log(response);
      this.answers = response.data.data.map((answer: IAnswerBefore) => {
        return {
          ...answer,
          epoch_submit: moment(answer.epoch_submit) 
        }
      });
    }).catch(err => {
      console.log(err);
    })
  },
  props: {
    theme_id: {
      type: Number,
      required: true
    }
  },
})
</script>

<style lang="scss" scoped>
</style>