<template>
  <div class="container">
    <errorMessage :message="errorMessage" :sub="subMessage"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import store from '@/store'
import router from '@/router'
import { AxiosResponse } from 'axios'
import errorMessage from '@/components/errorMessage.vue'


export default defineComponent({
  data() {
    return {
      user: {
        user_id: "",
        display_name: "",
      },
      errorMessage: "",
      subMessage: "",
    }
  },
  mounted() {
    let user_id = this.$route.params.user_id
    store.dispatch('request', {
      method: "GET",
      url: "/user/" + user_id
    }).then((response: AxiosResponse) => {
      console.log(response);
      this.user = response.data.data;
    }).catch(err => {
      console.log(err);
      this.errorMessage = "ユーザーが存在しません";
      this.subMessage = "自動的にホームに戻ります";
      setTimeout(() => { router.push('/'); }, 3000);
    })
  },
  components: {
    errorMessage
  }
})
</script>