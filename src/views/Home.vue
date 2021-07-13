<template>
  <div class="container">
    <div class="title">
      <h1>まい喜利</h1>
      <i/>
    </div>
    <div class="menu">
      <router-link :to="'/' + today.format('YYYY-MM-DD')">本日のお題</router-link>
      <router-link :to="'/' + diffday(-1).format('YYYY-MM-DD')" class="pc-only">昨日のお題</router-link>
      <router-link to="/mypage" v-if="isLoggedIn">マイページ</router-link>
      <router-link to="/login" v-else>ログイン</router-link>
    </div>
    <Message :message="errorMessage" :sub="sub" class="error"/>
    <div class="inner">
      <div class="active-themes">
        <h2>
          公開中のお題
        </h2>
        <ul v-if="activeThemes.length > 0">
          <li
            v-for="theme, i in activeThemes"
            :key="i"
          >
            <HomeTheme :theme="theme" :today="today"/>
          </li>
        </ul>
        <p v-else>
          お題の公開までしばらくお待ちください
        </p>
      </div>
      <div class="recent-activity" v-if="isLoggedIn">
        <h2>
          最近の結果
        </h2>
        <ul v-if="recentActivities.length > 0">
          <li
            v-for="theme, i in recentActivities"
            :key="i"
          >
            <HomeTheme :theme="theme" :today="today"/>
          </li>
        </ul>
        <p v-else>
          結果発表までしばらくお待ちください
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HomeTheme from '@/components/HomeTheme.vue'
import store from '@/store'
import { AxiosResponse } from 'axios'
import moment, { Moment } from 'moment'
import { ITheme } from '@/types'
import Message from '@/components/Message.vue'

export default defineComponent({
  name: 'DailyHome',
  data() {
    let today = moment();
    return {
      recentActivities: [] as ITheme[],
      activeThemes: [] as ITheme[],
      today,
      errorMessage: "",
      sub: "",
    }
  },
  mounted() {
    this.refresh();
  },
  methods: {
    moment_from(str: string): Moment {
      return moment(str)
    },
    diffday(diff: number): Moment {
      return this.today.clone().add(diff, 'days')
    },
    refresh() {
      this.errorMessage = "";
      this.sub = "";

      // console.log("refresh")

      let user_id = store.getters.userId;
      store.dispatch('request', {
        method: "GET",
        url: `/themes/recent/${user_id}`,
      }).then((response: AxiosResponse) => {
        // console.log(response);
        this.recentActivities = response.data.data
        .map((theme: ITheme) => {
          return {
            ...theme,
            epoch_open: moment(theme.epoch_open)
          } as ITheme
        });
      }).catch(err => {
        this.errorMessage = err.response.data.message;
      });

      store.dispatch('request', {
        method: "GET",
        url: `/themes/active`,
      }).then((response: AxiosResponse) => {
        // console.log(response);
        this.activeThemes = response.data.data
        .map((theme: ITheme) => {
          return {
            ...theme,
            epoch_open: moment(theme.epoch_open)
          } as ITheme
        });
      }).catch(err => {
        this.errorMessage = err.response.data.message;
      })
    }
  },
  components: {
    HomeTheme, Message
  },
  computed: {
    isLoggedIn() {
      return store.getters.isLoggedIn;
    }
  }
});
</script>

<style lang="scss" scoped>

.title {
  h1 {
    color: var(--main-bg);
    font-size: 3rem;
    font-family: 'Stick';
  }

  display: flex;
  justify-content: center;

  i {
    width: 3rem;
    height: 3rem;
    background-image: url("https://mygiri.vercel.app/icon-svg2.svg");
    background-size:100%;
    margin-bottom: -.3rem;
  }
}


.menu {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

  a {
    text-decoration: none;
    border: 2px solid var(--sub-bg);
    padding: 1.2rem 2rem;
    background: var(--light-bg);
    color: var(--main-bg);
    font-weight: bold;

    &.pc-only {
      display: none;
    }
  }

  margin: 1.2rem auto 2rem;
}

h2 {
  color: var(--sub-tx);
  font-size: 1.1rem;
  font-weight: bold;
  margin: .8rem auto 1.2rem;
}

.arrow {
  display: flex;
  justify-content: space-between;
  margin-bottom: .8rem;

  a {
    min-width: 3.2rem;
    text-decoration: none;
    background: var(--light-bg);
    border-bottom: 2px solid var(--sub-bg);
    padding: .6rem .4rem .4rem;
  }

  .fa-chevron-left {
    font-size: .9rem;
    margin-right: .4rem;
  }

  .fa-chevron-right {
    font-size: .9rem;
    margin-left: .4rem;
  }
}

.recent-activity {
  border-top: 2px dotted var(--main-bg);
  padding-top: .8rem;
}

@media screen and (min-width: 768px) {
  .inner {
    display: flex;

    > * {
      flex: 1;
    }
  }

  .menu a.pc-only {
    display: inline-block;
  }

  .recent-activity {
    border: none;
    padding-top: 0;
  }
}

</style>