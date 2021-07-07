<template>
  <div class="container">
    <p class="state-text" :class="'state-' + state.toLowerCase()">{{ stateText }}</p>
    <Theme :theme="castTheme" @click="route"/>
  </div>
</template>

<script lang="ts">
import { PropType, defineComponent } from 'vue'
import moment, { Moment } from 'moment'
import router from '@/router'
import Theme from '@/components/Theme.vue'
import { ITheme } from '@/types'

export default defineComponent({
  name: "HomeTheme",
  props: {
    theme: {
      type: Object as PropType<ITheme>,
    },
    today: {
      type: Object as PropType<Moment>,
    },
  },
  methods: {
    timeText(hours: number): string {
      let epoch_open = moment(this.theme?.epoch_open).add(hours, 'hours');
      let today = this.today?.clone();
      if (!today || !epoch_open) { return ""; }
      let text = !epoch_open ? "" :
        epoch_open?.isSame(today, 'day') ?
          epoch_open.format('H時') :
        epoch_open?.isSame(today.add(1, 'day'), 'day') ?
          epoch_open.format('明日H時') :
          epoch_open.format('M月D日H時')
      return text
    },
    route() {
      if(this.theme && this.state!=="Unpublished") {
        let url = "/theme/" + this.theme.id;
        router.push(url);
      }
    },
  },
  computed: {
    state(): string {
      let epoch_open = moment(this.theme?.epoch_open);
      return epoch_open && this.today ?
        this.today < epoch_open ? "Unpublished" :
        this.today < epoch_open.add(24, 'hours') ? "Accepting" :
        this.today < epoch_open.add(8, 'hours') ? "Voting" : "Closed" :
        "Dummy"
    },
    stateText(): string {
      switch (this.state) {
        case "Unpublished": return this.timeText(0) + "に公開";
        case "Accepting": return this.timeText(24) + "まで回答受付中";
        case "Voting": return this.timeText(24 + 8) + "まで投票受付中";
        case "Closed": return "結果発表";
        default: return "Dummy";
      }
    },
    castTheme(): ITheme | undefined {
      return this.state === "Unpublished" ?
        {...this.theme, theme_text: "？？？"} as ITheme :
        {...this.theme } as ITheme
    }
  },
  components: {
    Theme
  }
})
</script>

<style lang="scss" scoped>
.container {
  margin: .4rem 0 2rem;
}

.state-text {
  display: block;
}

p {
  &.state-accepting {
    color: var(--blue);
  }

  &.state-voting {
    color: var(--dark-orange)
  }

  &.state-closed {
    color: var(--purple);
  }
}
</style>