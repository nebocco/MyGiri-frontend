<template>
  <div class="home">
    <h2>Topページです</h2>
    {{ today.format() }}
    <p><br></p>
    <ul class="daily-themes">
      <li 
        v-for="theme, i in daily_themes"
        :key="i"
      >
        <HomeTheme :theme="theme" :today="today"/>
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
import { AxiosResponse } from 'axios';
import moment, { Moment } from 'moment';

interface IThemeRes {
  theme_id: number,
  author: string,
  theme_text: string,
  epoch_open: string,
}

export default defineComponent({
  name: 'Home',
  data() {
    return {
      daily_themes: [] as ITheme[],
      today: moment()//.add(9, 'hours')
    }
  },
  mounted() {
    let iso_date = this.today.format("YYYY-MM-DD");
    store.dispatch('request', {
      method: "GET",
      url: `/themes/date/${iso_date}`,
    }).then((response: AxiosResponse) => {
      console.log(response);
      this.daily_themes = response.data.data
      .map((theme: IThemeRes) => {
        return {
          ...theme,
          epoch_open: moment(theme.epoch_open)
        } as ITheme
      });
    })
  },
  methods: {
    moment_from(str: string): Moment {
      return moment(str)
    }
  },
  components: {
    HomeTheme
  }
});
</script>
