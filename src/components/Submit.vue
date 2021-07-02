<template>
  <div class="container">
    <p v-show="errorMessage">{{ errorMessage }}</p>
    <div class="submission">
      <input type="text" name="answer" v-model="answer"/>
      <button type="button" @click="checkedSubmit">OK</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: "Submit",
  data() {
    return {
      answer: "",
      errorMessage: "",
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
        this.submit(this.answer);
      }
    },
    submit(answer: string) {
      console.log(answer)
    }
  }
})
</script>

<style lang="scss" scoped>

input:invalid {
  border-color: red;
}

</style>