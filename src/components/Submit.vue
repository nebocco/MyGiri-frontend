<template>
  <div class="container">
    <div class="current-answer" v-if="currentAnswer">
      <p>現在の回答</p>
      <h3>{{ currentAnswer.answer_text }}</h3>
      <p class="small">表示の更新には数分程度かかる場合があります。</p>
    </div>
    <div class="submission">
      <input type="text" name="answer" v-model="answer" placeholder="回答を入力"/>
      <Message :message="errorMessage" class="error"/>
      <button type="button" @click="checkedSubmit">OK</button>
    </div>
    <ConfirmModal ref="confirm" @ok='submit'>
      <p>以下の内容で回答します。</p>
      <h3>{{ answer }}</h3>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import store from '@/store'
import router from '@/router'
import ConfirmModal from '@/components/confirmModal.vue'
import Message from '@/components/Message.vue'
import { AxiosResponse } from 'axios'

export default defineComponent({
  name: "Submit",
  data() {
    return {
      answer: "",
      errorMessage: "",
      currentAnswer: null,
    }
  },
  props: {
    theme_id: {
      type: Number,
      required: true,
    }
  },
  mounted() {
    let user_id = store.getters.userId;
    store.dispatch('request', {
      method: "GET",
      url: '/answer/' + this.theme_id + '/' + user_id,
    }).then((res: AxiosResponse) => {
      this.currentAnswer = res.data.data;
    }).catch((err) => {
      if (err.response.data.message !== 'Internal Server Error') {
        this.errorMessage = err.response.data.message;
      }
    }) 
  },
  methods: {
    checkedSubmit() {
      this.errorMessage = "";
      if (!this.answer) {
        this.errorMessage = "回答を入力してください";
        return
      } else if (this.answer.length > 100) {
        this.errorMessage = "回答は100文字以内に収めてください";
        return
      } else {
        this.errorMessage = "";
        (this.$refs.confirm as InstanceType<typeof ConfirmModal>).toggle();
      }
    },
    submit() {
      this.errorMessage = "";
      let answer = {
        user_id: store.getters.userId,
        theme_id: this.theme_id,
        answer_text: this.answer,
      }
      store.dispatch('request', {
        method: "POST",
        url: `/theme/${this.theme_id}`,
        data: answer
      }).then(() => {
        // console.log(response);
        router.push('/done');
      }).catch((err) => {
        // console.log(err);
        this.errorMessage = err.response.data.message;
      });
    }
  },
  components: {
    ConfirmModal, Message
  }
})
</script>

<style lang="scss" scoped>

input:invalid {
  border-color: red;
}

h3 {
  margin: .8rem 0;
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 120%;
}

p.small {
  font-size: .8rem;
}

</style>