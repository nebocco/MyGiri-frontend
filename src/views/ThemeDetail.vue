<template>
  <div class="container">
    <Theme :theme="theme" />
    <p>id: {{ theme.theme_id }}</p>
    <p>author: {{ theme.author }}</p>
    <Submit v-if="state==='Accepting'" />
    <Vote v-else-if="state==='Voting'" />
    <Result v-else-if="state==='Closed'" />
    <p v-else>公開時刻までお待ちください</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Theme, { ITheme } from '@/components/Theme.vue'
import store from '@/store'
import { AxiosResponse } from 'axios'
import moment from 'moment'
import Submit from '@/components/Submit.vue';
import Vote from '@/components/Vote.vue';
import Result from '@/components/Result.vue';


export default defineComponent({
  data() {
    return {
      theme: {
        theme_id: Number(this.$route.params.id),
        author: "",
        theme_text: "読み込み中...",
        epoch_open: moment().add(39, 'hours')
      } as ITheme,
      today: moment()
    }
  },
  mounted() {
    store.dispatch('request', {
      method: "GET",
      url: `/theme/${this.theme.theme_id}`
    }).then((response: AxiosResponse) => {
      console.log(response);
      let theme = response.data.data;
      this.theme = {
        ...theme,
        epoch_open: moment(theme.epoch_open) 
      } as ITheme;
    }).catch(err => {
      console.log(err);
      this.theme.theme_text = "お題が存在しません"
    })
  },
  components: {
    Theme, Vote, Result, Submit
  },
  computed: {
    state(): string {
      let epoch_open = this.theme.epoch_open.clone();
      return epoch_open && this.today ?
        this.today < epoch_open ? "Unpublished" :
        this.today < epoch_open.add(24, 'hours') ? "Accepting" :
        this.today < epoch_open.add(8, 'hours') ? "Voting" : "Closed" :
        "Dummy"
    },
  }
})
</script>