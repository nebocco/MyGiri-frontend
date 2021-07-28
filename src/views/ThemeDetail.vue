<template>
  <div class="container">
    <div class="arrow">
      <router-link :to="cameFrom">
        <i class="fas fa-chevron-left"/>戻る
      </router-link>
      <span @click="$refs.help.toggle" class="help-button">
        <i class="far fa-question-circle"/><span class="text">説明</span>
      </span>
    </div>
    <div class="theme" :class="{ 'pinned': isPinned }">
      <div class="head">
        <p>No.{{ theme.id }}</p>
        <p>お題提供:
          <router-link :to="`/user/${theme.user_id}`" v-if="state !== 'Unpublished'">
            {{ theme.display_name ?? theme.user_id }}
          </router-link>
        </p>
      </div>
      <Theme :theme="state !== 'Unpublished' ? theme : undefined" />
      <span class="pin-icon" @click="isPinned=!isPinned">
        <i class="fas fa-thumbtack" :class="{ 'pinned': isPinned }"/>
      </span>
    </div>
    <Message :message="errorMessage" class="error"/>
    <Submit v-if="state==='Accepting'" :theme_id="theme.id" :theme="theme"/>
    <Vote v-else-if="state==='Voting'" :theme_id="theme.id" :theme="theme"/>
    <Result v-else-if="state==='Closed'"  :theme_id="theme.id"/>
    <p v-else>公開時刻までお待ちください</p>
    <HelpModal ref="help" class="help">
      <div v-if="state==='Accepting'">
        <p>回答時間はお題公開から24時間です。</p>
        <p>一つのお題につき一答のみ回答可能です。</p>
        <p>新しい回答を送信すると上書きされます。</p>
      </div>
      <div v-else-if="state==='Voting'">
        <p>投票時間は回答時間終了から8時間です。</p>
        <p>ハート<i class="fas fa-heart"/>はお気に入りの回答一つにのみ投票可能です。</p>
        <p>スター<i class="fas fa-star"/>はいくつでも投票可能です。</p>
        <p>新しい投票を送信すると上書きされます。</p>
      </div>
      <div v-else-if="state==='Closed'">
        <p>順位はハート<i class="fas fa-heart"/>、スター<i class="fas fa-star"/>、投稿時間によって決定します。</p>
        <p>投票を行ってくれた人は、ボーナスとして<i class="fas fa-heart"/>が一つ追加されます。</p>
      </div>
      <div v-else>
        <p>このお題は現在未公開です。</p>
        <p>お題は毎日4, 12, 20時に公開されます。</p>
      </div>
      <p class="foot">詳しいルールは<router-link to="/rules">こちら</router-link></p>
    </HelpModal>
    <div class="share" v-show="state === 'Closed'">
      <a class="twitter-share-button" :href="tweetLink" target="_blank">
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Theme from '@/components/Theme.vue'
import store from '@/store'
import router from '@/router'
import { AxiosResponse } from 'axios'
import moment from 'moment'
import Submit from '@/components/Submit.vue'
import Vote from '@/components/Vote.vue'
import Result from '@/components/Result.vue'
import { ITheme } from '@/types'
import HelpModal from '@/components/helpModal.vue'
import Message from '@/components/Message.vue'

export default defineComponent({
  data() {
    return {
      theme: {
        id: Number(this.$route.params.id),
        user_id: "",
        theme_text: "読み込み中...",
        epoch_open: moment().add(39, 'hours')
      } as ITheme,
      today: moment(),
      errorMessage: "",
      isPinned: false
    }
  },
  mounted() {
    this.errorMessage = ""
    store.dispatch('request', {
      method: "GET",
      url: `/theme/${this.theme.id}`
    }).then((response: AxiosResponse) => {
      // console.log(response);
      let theme = response.data.data;
      this.theme = {
        ...theme,
        epoch_open: moment(theme.epoch_open)
      } as ITheme;
      this.$nextTick(() => {
        this.runScript();
      })
    }).catch(err => {
      // console.log(err)
      if (!err.response) {
        this.errorMessage = "不明なエラーが発生しました";
      } else if (err.response.status == 401) {
        router.push('/login');
      } else if (err.response.status !== 404) {
        this.errorMessage = err.response.data.message;
      }
    })
  },
  methods: {
    runScript () {
      const button = this.$el.querySelector('.twitter-share-button');
      const parentNode = button.parentNode;
      let script = document.createElement('script');
      script.setAttribute('src','https://platform.twitter.com/widgets.js');
      script.setAttribute('charset','utf-8');
      script.setAttribute('lang','ja');
      parentNode.appendChild(script);
      // console.log('done!');
    }
  },
  components: {
    Theme, Vote, Result, Submit, HelpModal, Message
  },
  computed: {
    state(): string {
      let epoch_open = moment(this.theme.epoch_open);
      return epoch_open && this.today ?
        this.today < epoch_open ? "Unpublished" :
        this.today < epoch_open.add(24, 'hours') ? "Accepting" :
        this.today < epoch_open.add(8, 'hours') ? "Voting" : "Closed" :
        "Dummy"
    },
    cameFrom(): string {
      return store.state.rememberRoot
    },
    tweetText(): string {
      let head = '';
      switch (this.state) {
        case "Accepting": {
          head = "回答受付中！\n";
          break;
        }
        case "Voting": {
          head = "投票受付中！\n";
          break
        }
        case "Closed": {
          head = "結果発表！\n";
          break
        }
      }
      return this.theme.theme_text !== "読み込み中..." ?
        head + '『' + this.theme.theme_text + '』\n' :
        'まい喜利 | 大喜利をゆるく楽しむWebサイト\n'
    },
    tweetLink(): string {
      return 'https://twitter.com/intent/tweet'
        + '?url=https://mygiri.vercel.app/theme/' + this.theme.id
        + '&text=' + encodeURI(this.tweetText)
        + '&hashtags=まい喜利';
    }
  }
})
</script>

<style lang="scss" scoped>
.head {
  font-size: .8rem;
  width: 90%;
  margin: 0 auto -.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  a {
    text-decoration: none;
  }
}

.arrow {
  display: flex;
  justify-content: space-between;
  margin-bottom: .8rem;
  align-items: center;

  a {
    min-width: 3.2rem;
    text-decoration: none;
    background: var(--light-bg);
    border-bottom: 2px solid var(--sub-bg);
    padding: .6rem .4rem .4rem;
  }

  .fa-chevron-left {
    margin-right: .2rem;
  }

  span.help-button {
    padding: .4rem;
    border: 2px solid var(--sub-bg);
    border-radius: .2rem;
    color: var(--sub-bg);
    font-weight: bold;
    cursor: pointer;
    display: flex;
    justify-content: center;

    span {
      display: inline-block;
      align-self: flex-end;
    }

    .fa-question-circle {
      color: var(--sub-bg);
      font-size: 1.2rem;
      margin-right: .2rem;
    }
  }
}

.theme {
  position: relative;
  padding: .4rem;
  background: white;

  &.pinned {
    position: sticky;
    top: 0;
    box-shadow: 0 4px 4px -4px var(--sub-bg);
  }

  span {
    position: absolute;
    // right: 0.8rem;
    right: 0;
    bottom: 0.8rem;
    
    i {
      color: #bbb;
      transform: rotate(45deg);

      &.pinned {
        color: var(--main-bg);
      }
    }
  }
}

.help {
  p {
    margin: .4rem auto;
  }

  .fa-heart {
    color: var(--pink);
  }

  .fa-star {
    color: var(--orange);
  }

  i {
    margin: 0 .1rem;
  }

  p.foot {
    margin-top: .8rem;
  }
}

.share {
  margin: 2rem 0;
  text-align: right;
}
</style>