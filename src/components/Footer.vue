<template>
  <div class="container">
    <small class="links">
      <router-link to="/rules">ルール</router-link>
      <router-link to="/terms">利用規約</router-link>
      <router-link to="/policy">プライバシーポリシー</router-link>
      <!-- <router-link to="/terms">お問い合わせ</router-link> -->
    </small>
    <small>
      Copyright © まい喜利 All rights reserved.
    </small>
  </div>
</template>

<style lang="scss" scoped>
.container {
  padding: .4rem;
  background: var(--main-bg);
  color: var(--rev-tx);
  border-top: 2px solid ver(--sec-bg);
}
</style>

<style lang="scss" scoped>
small {
  font-size: .8rem;
  display: block;
  line-height: 1.2rem;

  &.links {
    display: flex;
    justify-content: space-around;
    width: clamp(240px, 80%, 480px);
    align-items: baseline;
    margin: 0 auto;

    * {
      margin: 0 .2rem;
    }
  }
}
</style>