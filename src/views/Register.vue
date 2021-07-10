<template>
<div class="container">
  <h2>新規登録</h2>
  <form class="login-form">
    <div class="input-group">
      <label for="user-id">ユーザーID</label>
      <input type="text" name="user-id" v-model="input.userId">
    </div>
    <div class="input-group">
      <label for="display-name">名前</label>
      <input type="text" name="display-name" v-model="input.displayName">
    </div>
    <div class="input-group">
      <label for="password">パスワード</label>
      <input type="password" name="password" v-model="input.password">
    </div>
    <div class="input-group">
      <button type="button" @click="checkedRegister">新規登録</button>
    </div>
  </form>
  <Message :message="error" :sub="sub" class="error"/>
</div>
</template>

<script lang="ts">
import { AxiosResponse } from 'axios';
import { defineComponent } from 'vue';
import Message from '@/components/Message.vue'
import router from '@/router'
import store from '@/store';

export default defineComponent({
  name: 'Home',
  data() {
    return {
      input: {
        userId: "",
        displayName: "",
        password: "",
      },
      error: "",
      sub: "",
    }
  },
  methods: {
    checkedRegister() {
      this.error = "";
      this.sub = "";
      if (!this.input.userId) {
        this.error = "ユーザーIDを入力してください";
        return false;
      } else if (!this.input.password) {
        this.error = "パスワードを入力してください";
        return false;
      } else if(!this.checkString(this.input.userId) || !this.checkString(this.input.password)) {
        this.error = "ユーザーID、パスワードは半角英数字+アンダーバーで入力してください";
        return false;
      } else if(this.input.userId.length > 30) {
        this.error = "ユーザーIDは30文字以内にしてください";
        return false;
      } else if(this.input.displayName.length > 30) {
        this.error = "名前は40文字以内にしてください";
        this.sub = "全角文字は2文字分として数えます"
        return false;
      } else if(this.input.password.length > 30 || this.input.password.length < 8 ) {
        this.error = "パスワードは8文字以上30文字以内にしてください";
        return false;
      }
      this.register();
    },
    checkString(text: string) {
      var re = /^[A-Za-z0-9]*$/
      return re.test(text);
    },
    register() {
      let user = {
        user_id: this.input.userId,
        password: this.input.password,
        display_name: this.input.displayName === "" ? undefined: this.input.displayName
      };
      store.dispatch('request', {
        method: 'POST',
        url: '/auth/signup',
        data: user
      }).then((response: AxiosResponse) => {
        // console.log(response);
        if (response.status !== 200) {
          return Promise.reject(new Error(response.data));
        }
        return store.dispatch('request', {
          method: 'POST',
          url: '/auth/login',
          data: user
        })
      }).then((response: AxiosResponse) => {
        // console.log('FFF', response);
        if (response.status !== 200) {
          return Promise.reject(new Error(response.data));
        }
        store.dispatch('updateData', response.data.data)
        let to = store.state.rememberRoot;
        store.state.rememberRoot = '/';
        router.push(to);
      }).catch(err => {
        // console.log(err.response);
        let message = err.response.data.message;
        if (message.includes('already registered')) {
          this.error = "そのユーザーIDは既に使われています"
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
  color: var(--sub-tx);
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: .8rem;
}
</style>