<template>
  <div class="container">
    <div v-if="answered">
      <Message message="送信完了しました" sub="ご協力ありがとうございました"/>
    </div>
    <div v-else>
      <Message message="送信完了しました"/>
      <div class="questionnaire">
        <p>回答したいお題を募集しています</p>
        <input type="text" v-model="theme" />
        <button @click="checkedSubmit">送信</button>
        <Message :message="errorMessage" class="error" />
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Message from '@/components/Message.vue'
import ConfirmModal from '@/components/confirmModal.vue'
import store from '@/store'

export default defineComponent({
  name: "Done",
  data() {
    return {
      theme: "",
      errorMessage: "",
      answered: false
    }
  },
  methods: {
    checkedSubmit() {
      if (!this.theme) {
        this.errorMessage = "お題を入力してください";
        return
      } else if (this.theme.length > 80) {
        this.errorMessage = "お題は80文字以内に収めてください";
        return
      } else {
        this.errorMessage = "";
        (this.$refs.confirm as InstanceType<typeof ConfirmModal>).toggle();
      }
    },
    submit() {
      this.errorMessage = "";
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
        if (err.response.data.message == 'Internal Server Error') {
          this.errorMessage = "不明なエラーが発生しました";
        } else {
          this.errorMessage = err.response.data.message;
        }
      });
    }
  },
  components: {
    Message, ConfirmModal
  }
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
  margin: 2rem 0;
}

h3 {
  margin: .8rem 0;
  font-size: 1.2rem;
  font-weight: bold;
}

</style>