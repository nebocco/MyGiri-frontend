<template>
  <div class="container">
    <div class="arrow">
      <router-link :to="'/' + theme.epoch_open.format('YYYY-MM-DD')">
        <i class="fas fa-chevron-left"/>戻る
      </router-link>
    </div>
    <div class="head">
      <p>No.{{ theme.theme_id }}</p>
      <p>お題提供: {{ theme.author }}</p>
    </div>
    <Theme :theme="theme" />
    <Submit v-if="state==='Accepting'" :theme_id="theme.theme_id"/>
    <Vote v-else-if="state==='Voting'" :theme_id="theme.theme_id"/>
    <Result v-else-if="state==='Closed'"  :theme_id="theme.theme_id"/>
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

<style lang="scss" scoped>
.head {
  width: 90%;
  margin: 0 auto -.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.arrow {
  display: flex;
  justify-content: space-between;
  margin-bottom: .8rem;

  a {
    text-decoration: none;
    border-bottom: 1px solid green;
    padding: .4rem;
  }

  .fa-chevron-left {
    margin-right: .2rem;
  }
}
</style>