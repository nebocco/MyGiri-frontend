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
  <Message :message="error" :sub="sub" class="error"/>
</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import router from '@/router';
import store from '@/store';
import Message from '@/components/Message.vue'

export default defineComponent({
  data() {
    return {
      input: {
        userId: "",
        password: "",
      },
      error: "",
      sub: "",
    }
  }, 
  methods: {
    checkedLogin() {
      this.error = "";
      this.sub = "";
      if (!this.input.userId) {
        this.error = "ユーザーIDを入力してください";
        return false;
      } else if (!this.input.password) {
        this.error = "パスワードを入力してください";
        return false;
      } else if(!this.checkString(this.input.userId) || !this.checkString(this.input.password)) {
        this.error = "半角英数字で入力してください";
        return false;
      }
      this.error = "";
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
        let to = store.state.rememberRoot;
        store.state.rememberRoot = '/';
        router.push(to);
      }).catch(err => {
        this.error = "";
        this.sub = "";
        console.log(err.response);
        let message = err.response.data.message;
        if (message.includes('Wrong username or password')) {
          this.error = "ユーザーID、またはパスワードが間違っています";
        } else if (message == 'User not found, please signup') {
          this.error = "ユーザーが存在しません";
          this.sub = "新規登録してください";
        } else {
          this.error = err.response.data.message;
        }
      });
    }
  },
  components: {
    Message
  }
});
</script>

<style lang="scss" scoped>
h2 {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--sub-tx);
  margin-bottom: 1.6rem;
}

.input-group {
  margin: 5px;
}
</style>