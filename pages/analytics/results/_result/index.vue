<template>
  <div>
    <ul>
      <li>
        <nuxt-link to="/analytics">
          分析ツールTOP
        </nuxt-link>
        &gt; <nuxt-link to="/analytics/results">分析結果一覧</nuxt-link> &gt;
        分析結果
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  async asyncData({ params, error, $axios }) {
    const resultId = params.result
    const result = await $axios.$get(`/api/analytics/results/${resultId}`)
    console.log(result)
    return { result }
  }
}
</script>
