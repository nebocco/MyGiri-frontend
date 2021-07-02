<template>
  <div class="home">
    <h2>Topページです</h2>
    {{ today }}
    <ul class="daily-themes">
      <li 
        v-for="theme, i in daily_themes"
        :key="i"
      >
        <HomeTheme :theme="theme" :today="today" @click="route(theme.theme_id)"/>
      </li>
    </ul>
    <HomeTheme />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { ITheme } from '@/components/Theme.vue';
import HomeTheme from '@/components/HomeTheme.vue'
import store from '@/store'
import router from '@/router'
import { AxiosResponse } from 'axios';
import moment, { Moment } from 'moment';

export default defineComponent({
  name: 'Home',
  data() {
    return {
      daily_themes: [] as ITheme[],
      today: moment()
    }
  },
  mounted() {
    let iso_date = this.today.format("YYYY-MM-DD");
    store.dispatch('request', {
      method: "GET",
      url: `/themes/date/${iso_date}`,
    }).then((response: AxiosResponse) => {
      console.log(response);
      this.daily_themes = response.data.data;
    })
  },
  methods: {
    route(theme_id: number) {
      let url = `/theme/${theme_id}`;
      router.push(url);
    },
    moment_from(str: string): Moment {
      return moment(str)
    }
  },
  components: {
    HomeTheme
  }
});
</script>
