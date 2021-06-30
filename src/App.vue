<template>
  <header class="navbar-container" :class="isOpen ? 'opened' : 'closed'">
    <div class="mini-container">
      <h1 class><router-link to="/">TITLE</router-link></h1>
      <img
        id="mobile-cta"
        src="@/assets/menu.svg"
        alt="Open Navigation"
        @click="toggleNavbar"
      >
    </div>
    <nav :class="isOpen ? 'opened' : 'closed'">
      <ul>
        <li><router-link to="/">ホーム</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/register" @click="isOpen=false;">新規登録</router-link></li>
        <li v-if="!isLoggedIn"><router-link to="/login" @click="isOpen=false;">ログイン</router-link></li>
        <li v-if="isLoggedIn"><router-link to="/about" @click="isOpen=false;">マイページ</router-link></li>
        <li v-if="isLoggedIn"><router-link to="/" @click="{isOpen=false; logout();}">ログアウト</router-link></li>
      </ul>
    </nav>
  </header>
  <router-view/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import router from '@/router';
import store from '@/store';


export default defineComponent({
  data() {
    return {
      isOpen: false,
    }
  },
  computed: {
    isLoggedIn(): boolean {
      return store.getters.isLoggedIn;
    }
  },
  methods: {
    logout() {
      store.dispatch('request', {
        method: 'POST',
        url: 'auth/logout',
        data: {}
      })
      .then((response) => {
        console.log(response);
        store.dispatch('resetData');
        router.push('/');
      });
    },

    toggleNavbar() {
      this.isOpen = !this.isOpen;
    }
  }
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

header {
  margin-bottom: 1.2rem;
}

.navbar-container {
  padding: 1rem;
  background: #066;
  color: #eee;
  border-bottom: 2px solid #61f231;
  
  .mini-container {
    display: flex;
    justify-content: space-between;
    
    h1 {
      display: inline-block;
      font-size: 1.6rem;
      text-align: start;
    }

    #mobile-cta {
      color: #eee;
    }
  }

  nav {
    &.closed {
      display: none;
    }

    li {
      padding: .8rem;

      &:hover {
        font-weight: bold;
      }

      &:last-child {
        padding-bottom: 0;
      }
    }
  }

  a {
    text-decoration: none;
    &.router-link-exact-active {
      // color: #42b983;
      color: inherit;
    }
  }
}

@media screen and (min-width:768px) {
.navbar-container {
  display: flex;
  justify-content: flex-end;
  align-items: center;
 
  .mini-container {
    margin-right: auto;

    #mobile-cta {
      display: none;
    }
  }

  nav {
    background: inherit;
    width: clamp(240px, 30%, 300px);

    &.closed{
      display: block;
    }

    ul {
      display: flex;
      justify-content: space-between;
    }
    li {
      padding: 0;
    }
  }
}
}
</style>
