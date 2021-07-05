<template>
  <div class="container">
    <ul>
      <li 
        v-for="answer, i in answers"
        :key="i"
        @click="addScore(i)"
      >
        <span class="badge">
          <i class="fas fa-heart" v-show="scores[i] === 100000"/>
          <i class="fas fa-star" v-show="scores[i] === 1"/>
          <i class="far fa-circle" v-show="scores[i] === 0"/>
        </span>
        <h3>
          {{ answer.answer_text }}
        </h3>
      </li>
    </ul>
    <errorMessage :message="errorMessage" />
    <div class="button-container">
      <button @click="checkedSubmit">OK</button>
    </div>
    <ConfirmModal ref="confirm" @ok='submit'>
      <p>以下の内容で投票します。</p>
      <ul>
        <li v-for="vote, i in votes" :key="i">
          <span class="badge">
            <i class="fas fa-heart"
              v-show="vote.score === 100000"
            />
            <i class="fas fa-star"
              v-show="vote.score === 1"
            />
            <i class="far fa-circle"
              v-show="vote.score === 0"
            />
          </span>
          <h3>
            {{ answers.find(answer => answer.id === vote.answer_id).answer_text }}
          </h3>
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
ul {
  width: 90%;
  margin: 0 auto;
}

li {
  display: flex;
  align-items: baseline;
  padding: .8rem 0;
  border-bottom: 2px dotted gray;
}

h3 {
  font-size: 1.2rem;
  font-weight: bold;
  text-align: left;
}

.badge {
  margin-right: .4rem;
  width: 1rem;

  .fa-heart {
    color: magenta;
  }

  .fa-star {
    color: orange;
  }
}


.button-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 1.2rem;

  button {
    color: gray;
    font-weight: bold;
    width: 30%;
    padding: .4rem;
    border: 2px solid gray;
    border-radius: .4rem;
    background: none;
  }
}
</style>