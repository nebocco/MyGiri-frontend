<template>
  <div class="container">
    <div class="name" v-if="user.user_id">
      <h2>{{ user.display_name ?? user.user_id }}</h2>
      <h3 v-if="user.display_name">{{ user.user_id }}</h3>
    </div>
    <div class="score" v-if="!loading">
      <span>
        <i class="fa fa-heart"/>
        <p class="pink">{{ user.heart - user.self_vote }}+{{ user.self_vote }}</p>
        <i class="fa fa-star"/>
        <p class="orange">{{ user.star }}</p>
      </span>
    </div>
    <div class="table" v-if="!loading">
      <dl>
        <dt>総回答数</dt>
        <dd>{{ user.answer }}</dd>
      </dl>
      <dl>
        <dt>総出題回数</dt>
        <dd>{{ user.theme }}</dd>
      </dl>
      <dl>
        <dt>1位獲得回数</dt>
        <dd>{{ user.top_count }}</dd>
      </dl>
      <dl>
        <dt>平均いいね獲得数</dt>
        <dd>{{ ((user.heart - user.self_vote) / user.answer).toFixed(2) }}</dd>
      </dl>
      <dl>
        <dt>投票率</dt>
        <dd>{{ (user.self_vote * 100 / user.answer).toFixed(1) }}%</dd>
      </dl>
    </div>
    <Message :message="errorMessage" :sub="subMessage" class="error"/>
    <div class="arrow">
      <router-link to="/">
        <i class="fas fa-chevron-left"/>
        ホームへ
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import store from '@/store'
import router from '@/router'
import { AxiosResponse } from 'axios'
import Message from '@/components/Message.vue'
import { IProfile } from '@/types' 


export default defineComponent({
  data() {
    return {
      user: {
        user_id: "読み込み中...",
        heart: 0,
        star: 0,
        answer: 0,
        theme: 0,
        self_vote: 0,
        top_count: 0
      } as IProfile,
      errorMessage: "",
      subMessage: "",
      loading: true,
    }
  },
  mounted() {
    this.errorMessage = "";
    this.subMessage = "";
    let user_id = this.$route.params.user_id
    store.dispatch('request', {
      method: "GET",
      url: "/user/" + user_id
    }).then((response: AxiosResponse) => {
      // console.log(response);
      this.loading = false;
      this.user = response.data.data;
    }).catch(err => {
      // console.log(err);
      this.user.user_id = "";
      if (err.response.status == 404) {
        this.errorMessage = "ユーザーが存在しません";
        this.subMessage = "自動的にホームに戻ります";
      } else {
        this.errorMessage = err.response.data.message;
      }
      setTimeout(() => { router.push('/'); }, 3000);
    })
  },
  components: {
    Message
  }
})
</script>

<style lang="scss" scoped>

.container {
  text-align: left;
}

.name {
  display: flex;
  justify-content: left;
  align-items: baseline;
  width: 100%;
  flex-wrap: wrap;

  h2 {
    font-size: 1.8rem;
    margin-right: .8rem;
    color: var(--sub-tx);
    font-weight: bold;
    line-height: 120%;
  }

  h3 {
    font-size: 1.3rem;
    color: var(--sub-tx);
    min-width: 0;
  }
}

.score {
  margin-top: .4rem;
  font-size: 1.2rem;

  i {
    &.fa-heart {
      color: var(--pink);
    }

    &.fa-star {
      color: var(--orange);
    }
  }

  p {
    display: inline-block;
    margin: 0 .4rem 0 .2rem;

    &.pink {
      color: var(--pink);
    }

    &.orange {
      color: var(--dark-orange);
    }
  }
}

.table {
  margin-top: 1.6rem;
  border: 2px solid var(--sub-bg);

  dl {
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  dl:not(:last-child) {
    box-sizing: content-box;
    border-bottom: 2px solid var(--sub-bg);
    margin-bottom: -2px;
  }

  dt {
    box-sizing: content-box;
    flex: 7;
    text-align: center;
    padding: .8rem;
    background: var(--sub-bg);
    color: var(--rev-tx);
  }

  dd {
    box-sizing: content-box;
    flex: 3;
    text-align: center;
    padding-bottom: .7rem;
    font-size: 1.1rem;
  }
}

.arrow {
  display: flex;
  justify-content: center;
  margin-top: 1.6rem;

  a {
    min-width: 3.2rem;
    text-decoration: none;
    background: var(--light-bg);
    border-bottom: 2px solid var(--sub-bg);
    padding: .6rem;
  }

  .fa-chevron-left {
    font-size: .9rem;
    margin-right: .4rem;
  }
}

</style>