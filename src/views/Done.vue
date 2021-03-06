<template>
  <div class="container">
    <div v-if="answered">
      <Message message="送信完了しました" sub="ご協力ありがとうございました"/>
    </div>
    <div v-else>
      <Message message="送信完了しました"/>
      <div class="questionnaire">
        <p>お題を募集しています</p>
        <div class="input-group">
          <input type="text" v-model="theme" />
          <button @click="checkedSubmit">OK</button>
        </div>
        <Message :message="errorMessage" :sub="errorSub" class="error" />
      </div>
      <ConfirmModal ref="confirm" @ok='submit'>
        <p>以下の内容で投稿します。</p>
        <h3>{{ theme }}</h3>
      </ConfirmModal>
    </div>
    <div class="arrow">
      <router-link to="/">
      <i class="fas fa-chevron-left"></i>
        ホームへ
      </router-link>
    </div>
    <div class="share">
      <a class="twitter-share-button" :href="tweetLink" target="_blank">
      </a>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Message from '@/components/Message.vue'
import ConfirmModal from '@/components/confirmModal.vue'
import store from '@/store'
import router from '@/router'

export default defineComponent({
  name: "Done",
  data() {
    return {
      theme: "",
      errorMessage: "",
      errorSub: "",
      answered: false
    }
  },
  props: {
    theme_text: {
      type: String,
      required: true
    },
    action: {
      type: String,
      required: true,
    }
  },
  methods: {
    checkedSubmit() {
      this.errorMessage = "";
      this.errorSub = "";
      if (!this.theme) {
        this.errorMessage = "お題を入力してください";
        return
      } else if (this.theme.length > 100) {
        this.errorMessage = "お題は100文字以内に収めてください";
        return
      } else {
        (this.$refs.confirm as InstanceType<typeof ConfirmModal>).toggle();
      }
    },
    submit() {
      this.errorMessage = "";
      this.errorSub = "";
      let theme_dto = {
        user_id: store.getters.userId,
        theme_text: this.theme,
      }
      store.dispatch('request', {
        method: "POST",
        url: `/theme`,
        data: theme_dto
      }).then(() => {
        // console.log(response);
        this.answered = true;
      }).catch((err) => {
        if (!err.response) {
          this.errorMessage = "不明なエラーが発生しました";
        } else if (err.response.status == 500) {
          this.errorMessage = "サーバーエラーが発生しました";
        } else if (err.response.status == 401) {
          this.errorMessage = "認証に失敗しました";
          this.errorSub = "もう一度ログインしてください";
        } else {
          this.errorMessage = err.response.data.message;
        }
      });
    },
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
  mounted() {
    if (this.action === undefined || this.theme_text === undefined) {
      router.push('/');
      return;
    }
    this.runScript();
  },
  computed: {
    tweetText(): string {
      return this.theme_text && this.action ? 
      '題『' + this.theme_text + '』に' + this.action + 'しました！\n' :
      'まい喜利 | 大喜利をゆるく楽しむWebサイト\n'
    },
    tweetLink(): string {
      return 'https://twitter.com/intent/tweet'
        + '?url=https://mygiri.vercel.app/'
        + '&text=' + encodeURI(this.tweetText)
        + '&hashtags=まい喜利';
    }
  },
  components: {
    Message, ConfirmModal
  },
})
</script>

<style lang="scss" scoped>
.arrow {
  display: flex;
  justify-content: center;
  margin: .8rem auto;

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

.questionnaire {
  margin: 2rem 0 1.2rem;

  p {
    margin: .4rem auto;
  }
}

h3 {
  margin: .8rem 0;
  font-size: 1.2rem;
  font-weight: bold;
}

.share {
  margin: 2rem 0;
  text-align: right;
}

@media screen and (min-width: 768px) {
  .input-group {
    display: flex;
    width: clamp(240px, 90%, 960%);
    margin: 0 auto;
    align-items: center;

    input, button {
      margin: 0;
    }

    input {
      flex: 1;
      margin-right: .4rem;
    }
  }
}

</style>