<template>
  <div class="container">
    <ul>
      <li 
        v-for="answer, i in answers"
        :key="i"
      >
        <div class="ranking">
          <span class="badge">{{ i + 1 }}</span>
          <h3>
            {{ answer.answer_text }}
          </h3>
        </div>
        <p class="score">
          <span>
            <i
              class="fa-heart"
              :class="answer.voted ? 'fa' : 'far'"
            />
            {{ Math.floor(answer.score / 100000)}}
            <i class="fa fa-star"/>
            {{ Math.floor(answer.score % 100000)}}
          </span>
          <router-link :to="'/user/' + answer.user_id">
            {{ answer.display_name ?? answer.user_id }}
          </router-link>
        </p>
      </li>
    </ul>
    <Message :message="errorMessage" class="error"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from '@/store'
import { AxiosResponse } from 'axios'
import moment from 'moment'
import { IAnswer } from '@/types'
import Message from '@/components/Message.vue'

export default defineComponent({
  name: "Result",
  data() {
    return {
      answers: [] as IAnswer[],
      errorMessage: "",
    }
  },
  mounted() {
    this.errorMessage = "";
    store.dispatch('request', {
      method: "GET",
      url: `/theme/${this.theme_id}/result`
    }).then((response: AxiosResponse) => {
      // console.log(response);
      this.answers = response.data.data.map((answer: IAnswer) => {
        return {
          ...answer,
          epoch_submit: moment(answer.epoch_submit) 
        }
      });
    }).catch(err => {
      // console.log(err);
      this.errorMessage = err.response.data.message;
    })
  },
  props: {
    theme_id: {
      type: Number,
      required: true
    }
  },
  components: {
    Message
  }
})
</script>

<style lang="scss" scoped>
ul {
  width: 90%;
  margin: 0 auto;
}

li {
  padding: .8rem 0;
  border-bottom: 2px dotted var(--sub-tx);
}

.ranking {
  display: flex;
  align-items: flex-start;
}

h3 {
  font-size: 1.2rem;
  font-weight: bold;
  text-align: left;
  margin-left: .4rem;
  // width: 95%;
}

.badge {
  box-sizing: border-box;
  display: inline-block;
  font-weight: bold;
  color: var(--rev-tx);
  background: var(--main-bg);
  width: 1rem;
  min-width: 1rem;
  height: 1rem;
  font-size: .8rem;
  padding: .1rem;
  margin-top: .1rem;
  text-align: center;
}

p.score {
  margin-top: .4rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

i {
  &.fa-heart {
    color: var(--pink);
  }

  &.fa-star {
    color: var(--orange);
  }
}

a {
  text-decoration: none;
  font-weight: bold;
  color: var(--sub-tx);
}
</style>