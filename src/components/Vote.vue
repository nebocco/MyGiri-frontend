<template>
  <div class="container">
    <div class="head">
      <h2>投票</h2>
      <p>回答をタップで選択してください</p>
      <p><i class="fa fa-heart"/> は一つだけ選択可能です</p>
    </div>
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
    <Message :message="errorMessage" :sub="errorSub" class="error"/>
    <Message :message="message"/>
    <div class="button-container" v-if="answers.length">
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
import { defineComponent, PropType } from 'vue'
import { AxiosResponse } from 'axios'
import store from '@/store'
import router from '@/router'
import moment from 'moment'
import Message from '@/components/Message.vue'
import ConfirmModal from '@/components/confirmModal.vue'
import { IAnswer, IVote, ITheme } from '@/types'

export default defineComponent({
  name: "Vote",
  data() {
    return {
      answers: [] as IAnswer[],
      scores: [] as number[],
      errorMessage: "",
      errorSub: "",
      message: "",
    }
  },
  props: {
    theme_id: {
      type: Number,
      required: true
    },
    theme: {
      type: Object as PropType<ITheme>,
      required: true
    },
  },
  mounted() {
    this.errorMessage = "";
    this.errorSub = "";
    store.dispatch('request', {
      method: "GET",
      url: `/answers/theme/${this.theme_id}`
    }).then((response: AxiosResponse) => {
      // console.log(response);
      this.answers = response.data.data.map((answer: IAnswer) => {
        return {
          ...answer,
          epoch_submit: moment(answer.epoch_submit)
        }
      });
      this.scores = new Array(this.answers.length).fill(0);
      if (this.answers.length === 0) {
        this.message = "投稿がありませんでした";
      }
      return store.dispatch('request', {
        method: "GET",
        url: `/theme/${this.theme_id}/vote/${store.state.userId}`
      })
    }).then((response: AxiosResponse) => {
      // console.log(response);
      response.data.data.forEach((vote: IVote) => {
        let index = this.answers.findIndex(a => a.id === vote.answer_id);
        this.scores[index] += vote.score;
      })
    }).catch(err => {
      // console.log(err);
      if (!err.response) {
        this.errorMessage = "不明なエラーが発生しました";
      } else if (err.response.status == 401) {
        this.errorMessage = "認証に失敗しました";
        this.errorSub = "もう一度ログインしてください";
      } else if (err.response.status !== 404) {
        this.errorMessage = err.response.data.message;
      }
    })
  },
  methods: {
    checkedSubmit() {
      this.errorMessage = "";
      this.errorSub = "";
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
      (this.$refs.confirm as InstanceType<typeof ConfirmModal>).toggle();
    },
    submit() {
      this.errorMessage = "";
      this.errorSub = "";
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
      ).then(() => {
        // console.log(response);
        router.push({
          name: "Done",
          params: {
            theme_text: this.theme.theme_text,
            action: "投稿",
          }
        });
      }).catch((err) => {
        // console.log(err)
        if (!err.response) {
          this.errorMessage = "不明なエラーが発生しました";
        } else if (err.response.status == 401) {
          this.errorMessage = "認証に失敗しました";
          this.errorSub = "もう一度ログインしてください";
        } else {
          this.errorMessage = err.response.data.message;
        }
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
    Message, ConfirmModal
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

.head {
  h2 {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--sub-tx);
    margin: .8rem auto .4rem;
  }
  margin-bottom: .8rem;

  p {
    font-size: .8rem;
    line-height: 1.2rem;
  }

  .fa-heart {
    color: var(--pink);
  }
}

ul {
  width: 90%;
  margin: .8rem auto 0;
}

li {
  display: flex;
  align-items: baseline;
  padding: .8rem 0;
  border-bottom: 2px dotted var(--sub-tx);
}

li:first-child {
  border-top: 2px dotted var(--sub-tx);
}

h3 {
  font-size: 1.2rem;
  font-weight: bold;
  text-align: left;
  line-height: 120%;
  cursor: default;
}

.badge {
  margin-right: .4rem;
  width: 1rem;

  .fa-heart {
    color: var(--pink);
  }

  .fa-star {
    color: var(--orange);
    margin-left: -1px;
  }

  .fa-circle {
    color: transparent;
  }

  i {
    animation: fadeAnimation .25s;
  }
}


.button-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 1.2rem;
}

@keyframes fadeAnimation {
  0% {
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  30% {
    opacity: 0.5;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}
</style>