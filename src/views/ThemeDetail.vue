<template>
  <div class="container">
    <Theme :theme="theme" />
    <p>id: {{ theme.theme_id }}</p>
    <p>author: {{ theme.author }}</p>
    <Submit v-if="state==='Accepting'" />
    <Vote v-else-if="state==='Voting'" />
    <Result v-else-if="state==='Closed'" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Theme, { ITheme } from '@/components/Theme.vue'
import store from '@/store'
import { AxiosResponse } from 'axios'
import moment, { Moment } from 'moment'
import Submit from '@/components/Submit.vue';
import Vote from '@/components/Vote.vue';
import Result from '@/components/Result.vue';


export default defineComponent({
    data() {
      return {
        theme: {
          theme_id: Number(this.$route.params.id),
          author: "",
          theme_text: "",
          epoch_open: moment()
        } as ITheme,
        today: moment()
      }
    },
    mounted() {
      store.dispatch('request', {
        method: "GET",
        url: `/theme/${this.theme.theme_id}`,
        data: {}
      }).then((response: AxiosResponse) => {
        console.log(response);
        this.theme = response.data.data as ITheme;
      })
    },
    components: {
      Theme, Vote, Result, Submit
    },
    computed: {
      epoch_open(): Moment | undefined {
        return this.theme ? moment(this.theme.epoch_open) : undefined;
      },
      state(): string {
        return this.theme && this.today ?
          this.today < this.epoch_open! ? "Unpublished" :
          this.today < this.epoch_open!.add(24, 'hours') ? "Accepting" :
          this.today < this.epoch_open!.add(24 + 8, 'hours') ? "Voting" : "Closed" :
          "Dummy"
      }
    }
})
</script>