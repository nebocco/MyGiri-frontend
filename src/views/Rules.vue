<template>
  <div class="container">
    <h1>ルール</h1>
    <h2>出題</h2>
    <ul>
    <li>お題は毎日三題公開されます。</li>
    <li>回答後や投票後のアンケートからお題を投稿することが可能です。採用される保証はありませんのでご了承ください。</li>
    <li>お題の制限字数は100文字です。</li>
    </ul>

    <h2>回答</h2>
    <ul>
    <li>各お題につき一つの回答を投稿できます。</li>
    <li>回答制限時間はお題の公開から24時間です。</li>
    <li>回答の制限字数は100文字です。</li>
    <li>投票を行わず、回答のみに参加することも可能です。</li>
    <li>投稿は何度でも可能ですが、最後に投稿された回答のみが有効となります。</li>
    </ul>

    <h2>投票</h2>
    <ul>
    <li>各お題に投稿された回答から、おもしろいと思うものに投票を行うことができます。</li>
    <li>投票制限時間は回答締切から8時間です。</li>
    <li>回答を行わず、投票のみに参加することも可能です。</li>
    <li>投票は何度でも可能ですが、最後に送信された投票のみが有効となります。</li>
    <li>ハート<i class="fas fa-heart"/>は各お題につき一つだけ投票可能です。最も面白いと思った回答に投票してください。</li>
    <li>スター<i class="fas fa-star"/>は各お題につきいくつでも投票可能です。お気に入りの回答に投票してください。</li>
    <li>自分の回答に投票することはできません。</li>
    </ul>

    <h2>結果発表</h2>
    <ul>
    <li>投票が締め切られると、結果が発表されます。</li>
    <li>順位は「ハートの個数」「スターの個数」「投稿時間の早さ」の優先順位で決定されます。</li>
    <li>ユーザーページのステータスへの反映には5分程度かかります。</li>
    </ul>

    <h2>お問い合わせ</h2>
    <p>公式Twitterアカウント<a href="https://twitter.com/mygiri_mygiri">@mygiri_mygiri</a>までご連絡ください。</p>

  </div>
</template>

<style lang="scss" scoped>

.container {
  text-align: left;
}

* {
  line-height: 1.2rem;
}

h1 {
  text-align: center;
  color: var(--sub-tx);
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: .8rem;
}

h2 {
  color: var(--sub-tx);
  font-size: 1.1rem;
  margin: 1.6rem 0 .4rem;
}

i {
  margin: 0 .2rem;

  &.fa-heart {
    color: var(--pink);
  }

  &.fa-star {
    color: var(--orange);
  }
}


ul {
  margin: .4rem 0 .8rem 1.2rem;
}

li {
  display: list-item;
  list-style: outside disc;
  margin-bottom: .8rem;
}

.inner > li {
  list-style-type: lower-alpha;
}

</style>