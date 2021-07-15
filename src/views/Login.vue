<template>
<div class="container">
  <h2>ログイン</h2>
  <form class="login-form">
    <div class="input-group">
      <label for="user-id">ユーザーID</label>
      <input type="text" name="user-id" v-model="input.userId" autocomplete="username">
    </div>
    <div class="input-group">
      <label for="password">パスワード</label>
      <div class="input-visible" :class="{'focus': focus}">
        <input
          :type="visible ? 'text' : 'password'"
          name="password"
          id='password-input'
          v-model="input.password"
          autocomplete="password"
          @focus="focus=true;"
          @blur="focus=false;"
        >
        <span @click="visible = !visible">
          <i class="fa fa-eye" :class="visible ? 'visible' : 'invisible'"/>
        </span>
      </div>
    </div>
    <div class="input-group">
      <button type="button" @click="checkedLogin">送信</button>
    </div>
  </form>
  <Message :message="errorMessage" :sub="errorSub" class="error"/>
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
      errorMessage: "",
      errorSub: "",
      visible: false,
      focus: false,
    }
  },
  methods: {
    checkedLogin() {
      this.errorMessage = "";
      this.errorSub = "";
      if (!this.input.userId) {
        this.errorMessage = "ユーザーIDを入力してください";
        return false;
      } else if (!this.input.password) {
        this.errorMessage = "パスワードを入力してください";
        return false;
      } else if(!this.checkString(this.input.userId) || !this.checkString(this.input.password)) {
        this.errorMessage = "半角英数字+アンダーバーで入力してください";
        return false;
      }
      this.login();
    },
    checkString(text: string) {
      var re = /^[A-Za-z0-9_]*$/
      return re.test(text);
    },
    login() {
      this.errorMessage = "";
      this.errorSub = "";
      store.dispatch('request', {
        method: 'POST',
        url: '/auth/login',
        data: {
          user_id: this.input.userId,
          password: this.input.password,
        },
      }).then((response) => {
        // console.log(response)
        store.dispatch('updateData', response.data.data)
        let to = store.state.rememberRoot;
        router.push(to);
      }).catch(err => {
        // console.log(err.response);
        if (!err.response) {
          this.errorMessage = "不明なエラーが発生しました";
          return;
        }
        let message = err.response.data.message;
        if (message.includes('Wrong username or password')) {
          this.errorMessage = "ユーザーID、またはパスワードが間違っています";
        } else if (message == 'User not found, please signup') {
          this.errorMessage = "ユーザーが存在しません";
          this.errorSub = "新規登録してください";
        } else {
          this.errorMessage = err.response.data.message;
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
  display: flex;
  flex-direction: column;
}

.login-form {
  width: clamp(240px, 100%, 600px);
  margin: 0 auto;
}

.input-visible {
  display: flex;
  align-items: center;
  width: clamp(240px, 90%, 960px);
  margin: 0.4rem auto 0.8rem;
  border: 1px solid var(--main-bg);

  &.focus {
    outline: var(--main-bg) auto 1px;
  }

  input {
    margin: 0;
    flex: 1;
    border: none;

    &:focus-visible {
      outline: none;
    }
  }

  span {
    margin-right: .4rem;

    i.visible {
      color: var(--main-bg);
    }

    i.invisible {
      color: #bbb;
    }
  }
}

@media screen and (min-width:768px) {
  .input-group {
    flex-direction: row;
    justify-content: center;
    align-items: center;

    label {
      width: 25%;
    }

    input {
      flex: 1;
      width: 75%;
    }

    .input-visible {
      flex: 1;
      width: 75%;
    }
  }
}
</style>