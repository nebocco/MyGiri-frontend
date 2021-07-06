<template>
  <div class="container">
    <Message :message="errorMessage" class="error"/>
    <div class="submission">
      <input type="text" name="answer" v-model="answer" placeholder="回答を入力"/>
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
import { AxiosResponse } from 'axios'
import store from '@/store'
import router from '@/router'
import ConfirmModal from '@/components/confirmModal.vue'
import Message from '@/components/Message.vue'

export default defineComponent({
  name: "Submit",
  data() {
    return {
      answer: "",
      errorMessage: "",
    }
  },
  props: {
    theme_id: {
      type: Number,
      required: true,
    }
  },
  methods: {
    checkedSubmit() {
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
      let answer = {
        user_id: store.getters.userId,
        theme_id: this.theme_id,
        answer_text: this.answer,
      }
      store.dispatch('request', {
        method: "POST",
        url: `/theme/${this.theme_id}`,
        data: answer
      }).then((response: AxiosResponse) => {
        console.log(response);
        router.push('/done');
      }).catch((err) => {
        console.log(err)
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
}

</style>