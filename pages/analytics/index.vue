<template>
  <section>
    <p>
      <nuxt-link to="/">TOP</nuxt-link>
      &gt; 分析ツール TOP
    </p>
    <h2>分析ツール</h2>
    <ul>
      <li>
        <section>
          <h3>
            <nuxt-link to="/analytics/video_markup">
              1. 動画構成入力機能
            </nuxt-link>
          </h3>
          <p>
            動画の構成に基づく視聴ログの分析を行うために動画の解説内容・作業工程に基づく動画の構成の入力と動画内における視覚的遷移発生時点の入力を行います.
          </p>
        </section>
      </li>
      <li>
        <section>
          <h3>
            <nuxt-link to="/analytics/video_analyze">
              2. 動画視聴ログ分析機能
            </nuxt-link>
          </h3>
          <p>動画の視聴ログ分析を実際の視聴データを対象として行います.</p>
        </section>
      </li>
      <li>
        <section>
          <h3>
            <nuxt-link to="/analytics/results">
              3. 分析結果閲覧機能
            </nuxt-link>
          </h3>
          <p>過去の視聴ログ分析結果を閲覧することができます.</p>
        </section>
      </li>
    </ul>
  </section>
</template>
