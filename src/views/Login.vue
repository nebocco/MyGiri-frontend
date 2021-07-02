<template>
<div class="container">
  <h2>ログイン</h2>
  <form class="login-form">
    <div class="input-group">
      <label for="user-id">ユーザーID</label>
      <input type="text" name="user-id" v-model="input.userId">
    </div>
    <div class="input-group">
      <label for="password">パスワード</label>
      <input type="password" name="password" v-model="input.password">
    </div>
    <div class="input-group">
      <button type="button" @click="checkedLogin">送信</button>
    </div>
  </form>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import router from '@/router';
import store from '@/store';

export default defineComponent({
  data() {
    return {
      input: {
        userId: "",
        password: "",
      },
      validation: {
        comment: ""
      }
    }
  }, 
  methods: {
    checkedLogin() {
      if (!this.input.userId) {
        this.validation.comment = "ユーザーIDを入力してください";
        return false;
      } else if (!this.input.password) {
        this.validation.comment = "パスワードを入力してください";
        return false;
      } else if(!this.checkString(this.input.userId) || !this.checkString(this.input.password)) {
        this.validation.comment = "半角英数字で入力してください";
        return false;
      }
      this.validation.comment = "";
      this.login();
    },
    checkString(text: string) {
      var re = /^[A-Za-z0-9]*$/
      return re.test(text);
    },
    login() {
      store.dispatch('request', {
        method: 'POST',
        url: '/auth/login',
        data: {
          user_id: this.input.userId,
          password: this.input.password,
        },
      }).then((response) => {
        console.log(response)
        store.dispatch('updateData', response.data.data)
        router.push('/');
      });
    }
  }
});
</script>

<style scoped>
.input-group {
  margin: 5px;
}
</style>