<template>
  <section>
    <p>
      <nuxt-link to="/">TOP</nuxt-link>
      &gt;
      <nuxt-link to="/analytics">
        分析ツール TOP
      </nuxt-link>
      &gt; <nuxt-link to="/analytics/results/">分析結果一覧</nuxt-link> >
      分析結果
    </p>
    <h2>ID={{ result.id }} 分析結果</h2>
    <section>
      <h3>動画について</h3>
      <dl>
        <dt>動画名:</dt>
        <dd>
          #{{ result.video.order }} {{ result.video.title }} -
          {{ result.video.lessonTitle }}
        </dd>
      </dl>
    </section>
    <section>
      <h3>分析条件</h3>
      <dt>分析名:</dt>
      <dd>{{ result.name }}</dd>
      <dt>分析対象:</dt>
      <dd v-for="(user, index) in result.targetUsers" :key="index">
        * {{ user.name }}
      </dd>
      <dt>ノイズデータの取り除きしきい値(秒):</dt>
      <dd>{{ result.remove_margin }}</dd>
      <dt>分析実行時間:</dt>
      <dd>{{ formatDate(result.created_at) }}</dd>
      <dt>取り除きに利用した画面遷移</dt>
      <dd>
        {{ result.visualTransitionSequence.name }} ({{
          formatDate(result.visualTransitionSequence.created_at)
        }})
      </dd>
      <dt>取り除きに利用したセクション</dt>
      <dd>
        {{ result.sectionSequence.name }} ({{
          formatDate(result.sectionSequence.created_at)
        }})
      </dd>
    </section>
    <section>
      <h3>分析結果</h3>
      <section>
        <h4>データ整形後分析結果</h4>
        <table border>
          <tr>
            <th>開始時間</th>
            <th>終了時間</th>
            <th>セクション名</th>
            <th>イベント発生回数</th>
          </tr>
          <tr v-for="(aggregation, index) in result.aggregation" :key="index">
            <td>{{ aggregation.timeFrom }}</td>
            <td>{{ aggregation.timeTo }}</td>
            <td>{{ aggregation.name }}</td>
            <td>{{ aggregation.log_count }}</td>
          </tr>
          <tr>
            <td>{{ result.aggregation[0].timeFrom }}</td>
            <td>
              {{ result.aggregation[result.aggregation.length - 1].timeTo }}
            </td>
            <td>合計</td>
            <td>{{ result.aggregationSum }}</td>
          </tr>
        </table>
      </section>
      <section>
        <h4>データ整形前分析結果</h4>
      </section>

      <section>
        <h4>分析結果グラフ</h4>
        <BarChart :chartdata="chartData" :options="chartOptions" />
      </section>
    </section>
  </section>
</template>

<script>
import BarChart from '~/components/BarChart.vue'

export default {
  components: {
    BarChart
  },
  data() {
    return {}
  },
  computed: {
    chartData() {
      return {
        labels: this.result.aggregation.map(
          (aggregation) =>
            `${aggregation.name}(${aggregation.timeFrom} - ${aggregation.timeTo})`
        ),
        datasets: [
          {
            label: this.result.name,
            backgroundColor: '#2196F3',
            data: this.result.aggregation.map(
              (aggregation) => aggregation.log_count
            )
          }
        ]
      }
    },
    chartOptions() {
      return {
        maintainAspectRatio: false
      }
    }
  },
  async asyncData({ params, error, $axios }) {
    const resultId = params.result
    const result = await $axios.$get(`/api/analytics/results/${resultId}`)
    console.log(result)
    return { result }
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
