<template>
  <div class="container">
    {{ theme_id ?? 'a' }}
    <ul>
      <li 
        v-for="answer, i in answers"
        :key="i"
      >
        <p @click="addScore(i)">
          {{ answer.answer_text }}
        </p>
      </li>
    </ul>
    {{ scores }}
    <errorMessage :message="errorMessage" />
    <button @click="checkedSubmit">OK</button>
    <ConfirmModal ref="confirm" @ok='submit'>
      <p>以下の内容で投票します。</p>
      <ul>
        <li v-for="vote, i in votes" :key="i">
          {{ vote }}
        </li>
      </ul>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AxiosResponse } from 'axios'; 
import store from '@/store';
import router from '@/router';
import moment, { Moment } from 'moment';
import errorMessage from '@/components/errorMessage.vue'
import ConfirmModal from '@/components/confirmModal.vue'

export interface IAnswer {
  id: number,
  user_id: string,
  theme_id: number,
  answer_text: number,
  epoch_submit: Moment,
  score: number,
  voted: boolean
}

export interface IAnswerBefore {
  id: number,
  user_id: string,
  theme_id: number,
  answer_text: number,
  epoch_submit: string,
  score: number,
  voted: boolean
}

interface IVote {
  user_id: string,
  theme_id: number,
  answer_id: number,
  score: number,
}

export default defineComponent({
  name: "Vote",
  data() {
    return {
      answers: [] as IAnswer[],
      scores: [] as number[],
      errorMessage: ""
    }
  },
  props: {
    theme_id: {
      type: Number,
      required: true
    }
  },
  mounted() {
    store.dispatch('request', {
      method: "GET",
      url: `/answers/theme/${this.theme_id}`
    }).then((response: AxiosResponse) => {
      console.log(response);
      this.answers = response.data.data.map((answer: IAnswerBefore) => {
        return {
          ...answer,
          epoch_submit: moment(answer.epoch_submit) 
        }
      });
      this.scores = new Array(this.answers.length).fill(0);
      return store.dispatch('request', {
        method: "GET",
        url: `/theme/${this.theme_id}/vote/${store.state.userId}`
      })
    }).then((response: AxiosResponse) => {
      console.log(response);
      response.data.data.forEach((vote: IVote) => {
        let index = this.answers.findIndex(a => a.id === vote.answer_id);
        this.scores[index] += vote.score;
      })
    }).catch(err => {
      console.log(err);
    })
  },
  methods: {
    checkedSubmit() {
      for (let i = 0; i < this.answers.length; i++) {
        let answer = this.answers[i];
        let score = this.scores[i];
        if (answer.user_id == store.getters.userId && score > 0) {
          this.errorMessage = "自分の回答には点数を付けられません";
          return;
        }
      }
      if (this.scores.reduce((sum, ele) => sum + ele) >= 200000) {
          this.errorMessage = "ハートは一つしか付けられません";
          return;
      }
      if (this.scores.reduce((sum, ele) => sum + ele) === 0) {
          this.errorMessage = "投票内容が空です";
          return;
      }
      this.errorMessage = "";
      (this.$refs.confirm as InstanceType<typeof ConfirmModal>).toggle();
    },
    submit() {
      let user_id = store.getters.userId;
      let theme_id = this.theme_id;
      let votes = this.votes;
      store.dispatch('request',
        {
          method: "POST",
          url: `/theme/${this.theme_id}/vote`,
          data: {
            user_id,
            theme_id,
            votes
          }
        }
      ).then((response: AxiosResponse) => {
        console.log(response);
        router.push('/done');
      }).catch((err) => {
        console.log(err)
      });
    },
    addScore(index: number) {
      if (this.scores[index] === 0) {
        this.scores[index] = 1;
      } else if (this.scores[index] === 1) {
        this.scores[index] = 100000;
      } else if (this.scores[index] === 100000) {
        this.scores[index] = 0;
      }
    }
  },
  components: {
    errorMessage, ConfirmModal
  },
  computed: {
    votes(): IVote[] {
      let user_id = store.getters.userId;
      let theme_id = this.theme_id;

      return this.scores
      .map((vote, i) => {
        return {
          user_id,
          theme_id,
          answer_id: this.answers[i].id,
          score: vote
        }
      }).filter(vote => vote.score > 0);
    }
  }
})
</script>

<style lang="scss" scoped>
</style>