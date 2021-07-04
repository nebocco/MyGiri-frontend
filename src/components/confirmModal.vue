<template>
  <transition name="fade">
    <div
      class="modal-wrapper"
      v-show="isOpened"
      @click.self="toggle"
    >
      <div class="modal-container">
        <div class="modal-text">
          <slot></slot>
        </div>
        <div class="button-container">
          <button @click="emit('ok')" class="ok"> OK </button>
          <button @click="emit('cancel')" class="cancel"> Cancel </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  name: "ConfirmModal",
  data() {
    return {
      isOpened: false,
    }
  },
  methods: {
    toggle() {
      this.isOpened = !this.isOpened;
    },

    emit(command: string) {
      this.toggle();
      this.$emit(command);
    },
  },

  props: {
    savedDataNames: Array
  },

  watch: {
    isOpened () {
      document.body.className = this.isOpened ? 'modal-opened' : '';
    }
  }
})
</script>

<style scoped>

.modal-wrapper {
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  background: rgba(0,0,0,.75);
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-container {
  background: white;
  position: relative;
}

.modal-text {
  height: auto;
  max-height: 100%;
  width: 90%;
  margin: 0 auto;
  overflow: auto;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.button-container {
  display: flex;
}

</style>