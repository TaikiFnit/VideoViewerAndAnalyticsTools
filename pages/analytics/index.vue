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
              1. 動画のセクショニング
            </nuxt-link>
          </h3>
          <p>
            動画の構成に基づく視聴ログの分析を行うために動画をマークアップします.
          </p>
        </section>
      </li>
      <li>
        <section>
          <h3>
            <nuxt-link to="/analytics/video_analyze">
              2. 動画視聴ログ分析
            </nuxt-link>
          </h3>
          <p>動画の視聴ログ分析を実際の視聴データを対象として行います.</p>
        </section>
      </li>
      <li>
        <section>
          <h3>
            <nuxt-link to="/analytics/results">
              3. 分析結果一覧
            </nuxt-link>
          </h3>
          <p>過去の視聴ログ分析結果を閲覧することができます.</p>
        </section>
      </li>
    </ul>
  </section>
</template>
