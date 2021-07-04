<template>
  <div class="container">
    {{ theme_id ?? 'a' }}
    <p v-show="errorMessage">{{ errorMessage }}</p>
    <div class="submission">
      <input type="text" name="answer" v-model="answer"/>
      <button type="button" @click="checkedSubmit">OK</button>
    </div>
    <ConfirmModal ref="confirm" @ok='submit'>
      <p>以下の内容で回答します。</p>
      <p>{{ answer }}</p>
    </ConfirmModal>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { AxiosResponse } from 'axios'
import store from '@/store'
import router from '@/router'
import ConfirmModal from '@/components/confirmModal.vue'

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
        this.errorMessage = "解答を入力してください";
        return
      } else if (this.answer.length > 100) {
        this.errorMessage = "解答は100文字以内に収めてください";
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
    ConfirmModal
  }
})
</script>

<style lang="scss" scoped>

input:invalid {
  border-color: red;
}

</style>