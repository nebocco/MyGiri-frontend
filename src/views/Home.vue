<template>
  <div class="home">
    <h2>DailyTopページです</h2>
    {{ $route.params.date }}
    <br>
    {{ today.format() }}
    <br>
    {{ targetDay.format() }}
    <div class="arrow">
      <router-link :to="'/' + diffday(-1).format('YYYY-MM-DD')">前の日</router-link>
      <router-link :to="'/' + diffday(1).format('YYYY-MM-DD')">次の日</router-link>
    </div>
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
    let today = moment();
    return {
      daily_themes: [] as ITheme[],
      today,
      targetDay: moment(this.$route.params.date) ?? today.clone()
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
      return this.targetDay.clone().add(diff, 'days')
    },
    refresh() {
      console.log('refresh');
      this.targetDay = moment(this.$route.params.date) ?? this.today.clone();
      let iso_date = this.targetDay.format('YYYY-MM-DD');
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
    }
  },
  components: {
    HomeTheme
  },
  watch: {
    $route() {
      if (this.$route.name?.toString().includes("Home")) {
        this.refresh();
      }
    }
  }
});
</script>
