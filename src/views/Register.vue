<template>
<div class="container">
  <h2>新規登録</h2>
  <form class="login-form">
    <div class="input-group">
      <label for="user-id">ユーザーID</label>
      <input type="text" name="user-id" id='user-id-input' v-model="input.userId" autocomplete="username">
    </div>
    <div class="input-group">
      <label for="display-name">名前</label>
      <input type="text" name="display-name" v-model="input.displayName">
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
      visible: false,
      focus: false,
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
        this.error = "名前は30文字以内にしてください";
        return false;
      } else if(this.input.password.length > 30 || this.input.password.length < 8 ) {
        this.error = "パスワードは8文字以上30文字以内にしてください";
        return false;
      }
      this.register();
    },
    checkString(text: string) {
      var re = /^[A-Za-z0-9_]*$/
      return re.test(text);
    },
    register() {
      this.error = "";
      this.sub = "";
      let user = {
        user_id: this.input.userId,
        password: this.input.password,
        display_name: this.input.displayName === "" ? undefined: this.input.displayName
      };
      store.dispatch('request', {
        method: 'POST',
        url: '/auth/signup',
        data: user
      }).then(() => {
        // console.log(response);
        return store.dispatch('request', {
          method: 'POST',
          url: '/auth/login',
          data: user
        })
      }).then((response: AxiosResponse) => {
        // console.log('FFF', response);
        store.dispatch('updateData', response.data.data)
        let to = store.state.rememberRoot;
        router.push(to);
      }).catch(err => {
        // console.log(err.response);
        if (!err.response) {
          this.error = "不明なエラーが発生しました";
        } else if (err.response.data.message.includes('already registered')) {
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
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: .8rem;
}

.login-form {
  width: clamp(240px, 100%, 600px);
  margin: 0 auto;
}

.input-group {
  display: flex;
  flex-direction: column;
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