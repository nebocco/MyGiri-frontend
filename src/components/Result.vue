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
          <span class="score">
            <i
              class="fa-heart"
              :class="answer.voted ? 'fa' : 'far'"
            />
            {{ Math.floor(answer.score / 100000)}}
            <i class="fa fa-star"/>
            {{ Math.floor(answer.score % 100000)}}
          </span>
          <router-link :to="'/user/' + answer.user_id">
            {{ answer.user_id }}
          </router-link>
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
ul {
  width: 90%;
  margin: 0 auto;
}

li {
  padding: .8rem 0;
  border-bottom: 2px dotted gray;
}

.ranking {
  display: flex;
  align-items: baseline;
}

h3 {
  font-size: 1.2rem;
  font-weight: bold;
  text-align: left;
}

.badge {
  font-weight: bold;
  color: white;
  background: navy;
  margin-right: .4rem;
  // border: 2px solid navy;
  min-width: 1rem;
  min-height: 1rem;
  padding: .2rem;
  vertical-align: center;
}

p.score {
  margin-top: .4rem;
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

i {
  &.fa-heart {
    color: magenta;
  }

  &.fa-star {
    color: orange;
  }
}

a {
  text-decoration: none;
  font-weight: bold;
  color: gray;
}
</style>