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
      <div class="arrow">
        <router-link to="/">
        <i class="fas fa-chevron-left"></i>
          ホームへ
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Message from '@/components/Message.vue'
import ConfirmModal from '@/components/confirmModal.vue'
import store from '@/store'
import { AxiosResponse } from 'axios' 

export default defineComponent({
  name: "Done",
  data() {
    return {
      theme: "",
      errorMessage: "a",
      answered: false
    }
  },
  methods: {
    checkedSubmit() {
      if (!this.theme) {
        this.errorMessage = "お題を入力してください";
        return
      } else if (this.theme.length > 100) {
        this.errorMessage = "お題は100文字以内に収めてください";
        return
      } else {
        this.errorMessage = "";
        (this.$refs.confirm as InstanceType<typeof ConfirmModal>).toggle();
      }
    },
    submit() {
      let theme_dto = {
        author: store.getters.userId,
        theme_text: this.theme,
      }
      store.dispatch('request', {
        method: "POST",
        url: `/theme`,
        data: theme_dto
      }).then((response: AxiosResponse) => {
        console.log(response);
        this.answered = true;
      }).catch((err) => {
        console.log(err)
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
    text-decoration: none;
    border-bottom: 1px solid green;
    padding: .4rem;
  }

  .fa-chevron-left {
    font-size: .9rem;
    margin-right: .4rem;
  }
}

.questionnaire {
  margin: 2rem 0;
}
</style>