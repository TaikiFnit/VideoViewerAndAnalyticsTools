<template>
  <div>
    <ul>
      <li>
        <nuxt-link to="/analytics">
          分析ツールTOP
        </nuxt-link>
        &gt; 分析結果一覧 &gt;
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
    return { result }
  }
}
</script>
