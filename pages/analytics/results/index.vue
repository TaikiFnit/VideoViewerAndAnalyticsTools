<template>
  <section>
    <p>
      <nuxt-link to="/">TOP</nuxt-link>
      &gt;
      <nuxt-link to="/analytics">
        分析ツール TOP
      </nuxt-link>
      &gt; 分析結果一覧
    </p>
    <h2>分析結果一覧ページ</h2>
    <ul>
      <li v-for="(result, index) in results" :key="index">
        <section>
          <h3>
            <nuxt-link :to="`/analytics/results/${result.id}`">
              ID={{ result.id }}
              {{ result.name }}
            </nuxt-link>
          </h3>
          <p>
            分析実行日時: {{ formatDate(result.created_at) }} <br />
            #{{ result.order }} {{ result.videoTitle }} -
            {{ result.lessonTitle }}
          </p>
        </section>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  async asyncData({ params, error, $axios }) {
    const results = await $axios.$get(`/api/analytics/results/`)
    return { results }
  },
  methods: {
    formatDate(d) {
      const date = new Date(d)
      return (
        [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/') +
        ' ' +
        date.toLocaleTimeString()
      )
    }
  }
}
</script>
