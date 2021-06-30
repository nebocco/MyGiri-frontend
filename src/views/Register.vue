<template>
<div class="container">
  <h2>新規登録</h2>
  <form class="login-form">
    <div class="input-group">
      <label for="user-id">ユーザーID</label>
      <input type="text" name="user-id" v-model="input.userId">
    </div>
    <div class="input-group">
      <label for="user-name">ユーザー名</label>
      <input type="text" name="user-name" v-model="input.userName">
    </div>
    <div class="input-group">
      <label for="password">パスワード</label>
      <input type="password" name="password" v-model="input.password">
    </div>
    <div class="input-group">
      <button type="button" @click="checkedRegister">新規登録</button>
    </div>
  </form>
</div>
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { defineComponent } from 'vue';
import router from '@/router'
import store from '@/store';

export default defineComponent({
  name: 'Home',
  data() {
    return {
      validation: {
        comment: ""
      },
      input: {
        userId: "",
        userName: "",
        password: "",
      }
    }
  },
  methods: {
    checkedRegister() {
      if (!this.input.userId) {
        this.validation.comment = "ユーザーIDを入力してください";
        return false;
      } else if (!this.input.password) {
        this.validation.comment = "パスワードを入力してください";
        return false;
      } else if(!this.checkString(this.input.userId) || !this.checkString(this.input.password)) {
        this.validation.comment = "ユーザーID/パスワードは半角英数字で入力してください";
        return false;
      }
      this.validation.comment = "";
      this.register();
    },
    checkString(text: string) {
      var re = /^[A-Za-z0-9]*$/
      return re.test(text);
    },
    register() {
      store.dispatch('request', {
        method: 'POST',
        url: '/auth/signup',
        data: {
          user_id: this.input.userId,
          password: this.input.password,
        }
      }).then((response: AxiosResponse) => {
        console.log(response);
        return store.dispatch('request', {
          method: 'POST',
          url: '/auth/login',
          data: {
            user_id: this.input.userId,
            password: this.input.password,
          }
        })
      }).then((response: AxiosResponse) => {
        console.log(response);
        store.dispatch('updateData', response.data.data)
        router.push('/');
      });
    }
  }
});
</script>
