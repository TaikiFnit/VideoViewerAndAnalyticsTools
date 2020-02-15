<template>
  <section>
    <p>
      <nuxt-link to="/">TOP</nuxt-link>
      &gt;
      <nuxt-link to="/analytics">
        分析ツール TOP
      </nuxt-link>
      &gt; 動画視聴ログ分析機能
    </p>
    <h2>2. 動画視聴ログ分析機能</h2>
    <fieldset>
      <legend>2.1 分析に利用したい動画を選択してください</legend>
      <p>
        <small>
          ※
          <nuxt-link to="/analytics/video_markup">
            1. 動画のセクショニング </nuxt-link
          >で画面遷移と動画の解説内容に基づくセクショニングが完了している場合のみ分析が可能です.
        </small>
      </p>
      <p>
        <select v-model="videoIndex">
          <option v-for="(video, index) in videos" :key="index" :value="index">
            {{ video.id }} : #{{ video.order }} {{ video.title }} -
            {{ video.lessonTitle }}
          </option>
        </select>
      </p>
      <section v-if="videoIndex != null">
        <h3>選択した動画について</h3>
        <dl>
          <dt>動画ID</dt>
          <dd>{{ videos[videoIndex].id }}</dd>
          <dt>動画名</dt>
          <dd>{{ videos[videoIndex].title }}</dd>
          <dt>レッスン名</dt>
          <dd>{{ videos[videoIndex].lessonTitle }}</dd>
        </dl>
      </section>
    </fieldset>
    <fieldset v-if="videoIndex !== null">
      <legend>2.2 分析に利用するセクション, 画面遷移を選択してください</legend>
      <p>
        <label
          >2.2.1 定義済みのセクションを選択:
          <select v-model="sectionSequenceId">
            <option
              v-for="(section, index) in sequences.sectionSequences"
              :key="index"
              :value="section.id"
            >
              {{ section.id }} : {{ section.name }} ({{
                formatDate(section.created_at)
              }})
            </option>
          </select>
        </label>
      </p>
      <p>
        <label
          >2.2.2 定義済みの画面遷移を選択:
          <select v-model="visualTransitionSequenceId">
            <option
              v-for="(section, index) in sequences.visualTransitionSequences"
              :key="index"
              :value="section.id"
            >
              {{ section.id }} : {{ section.name }} ({{
                formatDate(section.created_at)
              }})
            </option>
          </select>
        </label>
      </p>
      <section
        v-if="sectionSequenceId !== null || visualTransitionSequenceId !== null"
      >
        <h3>選択したセクション, 画面遷移について</h3>
        <section v-if="sectionSequenceId !== null">
          <h4>セクション</h4>
          <table>
            <tr>
              <th>開始時間</th>
              <th>終了時間</th>
              <th>セクション名</th>
            </tr>
            <tr v-for="(section, index) in sections.sections" :key="index">
              <td>{{ section.timeFrom }}</td>
              <td>{{ section.timeTo }}</td>
              <td>{{ section.name }}</td>
            </tr>
          </table>
        </section>
        <section v-if="visualTransitionSequenceId !== null">
          <h4>画面遷移</h4>
          <table>
            <tr>
              <th>開始時間</th>
              <th>終了時間</th>
              <th>画面名</th>
            </tr>
            <tr
              v-for="(section, index) in sections.visualTransitions"
              :key="index"
            >
              <td>{{ section.timeFrom }}</td>
              <td>{{ section.timeTo }}</td>
              <td>{{ section.name }}</td>
            </tr>
          </table>
        </section>
      </section>
    </fieldset>
    <fieldset v-if="isSelectedSequences">
      <legend>2.3 分析条件の指定</legend>
      <h3>対象ユーザー</h3>
      <ul>
        <li v-for="(user, index) in targets.masterUsers" :key="index">
          <input
            v-model="targets.selectedUsers"
            :value="user.id"
            :id="user.id"
            type="checkbox"
          />
          <label :for="user.id">
            {{ user.name }}
            <p>学習完了済み: {{ user.learningCompleted ? 'Yes' : 'No' }}</p>
            <p>イベント発生回数: {{ user.countInteractions }}</p>
          </label>
        </li>
      </ul>
      <h3>ノイズデータの取り除きしきい値(秒)</h3>
      <p>
        画面遷移発生時点はつまづきの有無にかかわらず視聴ピークが発生することが報告されています[1]<br />今回の分析において画面遷移発生時点から+-何秒時点までのデータを取り除くのか指定してください
      </p>
      <label><input v-model="removeMargin" type="number" />秒</label>
      <p>
        <small
          >[1] Juho Kim, Philip J. Guo, Daniel T. Seaton, Piotr Mitros,
          Krzysztof Z. Gajos, Robert C. Miller: Understanding In-Video Dropouts
          and Interaction Peaks in Online Lecture Videos, L@S 2014 • Course
          Materials, pp. 31-40 (2014)</small
        >
      </p>
    </fieldset>
    <fieldset v-if="isSelectedSequences">
      <legend>2.4 分析開始</legend>
      <p>
        <label
          >分析結果に名前をつける: <input v-model="analyzeName" type="text"
        /></label>
      </p>
      <button @click="onClickStartAnalyze" :disabled="resultId !== null">
        分析開始
      </button>
    </fieldset>
    <fieldset v-if="resultId !== null">
      <legend>2.5 分析完了</legend>
      <p>
        分析が完了しました. 分析結果は, <strong>ID={{ resultId }}</strong
        >として保存されました.
      </p>
      <p>
        分析結果は,
        <nuxt-link :to="`/analytics/results/${resultId}`"
          >分析結果ページ</nuxt-link
        >から閲覧することができます.
      </p>
    </fieldset>
  </section>
</template>

<script>
export default {
  data() {
    return {
      videoIndex: null,
      sectionSequenceId: null,
      visualTransitionSequenceId: null,
      sequences: {},
      sections: {
        sections: [],
        visualTransitions: []
      },
      targets: {
        masterUsers: [],
        selectedUsers: []
      },
      removeMargin: 1,
      resultId: null,
      analyzeName: '分析'
    }
  },
  computed: {
    isSelectedSequences() {
      return (
        this.sectionSequenceId !== null &&
        this.visualTransitionSequenceId !== null
      )
    }
  },
  watch: {
    async videoIndex(newVideoIndex, oldVideoIndex) {
      const video = this.videos[newVideoIndex]
      this.fetchVideoSequences(video.id)

      this.targets.masterUsers = await this.$axios.$get(
        `/api/analytics/target_users/${video.id}`
      )
    },
    async sectionSequenceId(newId, oldId) {
      this.sections.sections = await this.$axios.$get(
        `/api/analytics/sectioning/${newId}`
      )
    },
    async visualTransitionSequenceId(newId, oldId) {
      this.sections.visualTransitions = await this.$axios.$get(
        `/api/analytics/sectioning/${newId}`
      )
    }
  },
  async asyncData({ params, error, $axios }) {
    const videos = await $axios.$get('/api/videos/analyzable')
    return { videos }
  },
  methods: {
    formatDate(d) {
      const date = new Date(d)
      return (
        [date.getFullYear(), date.getMonth() + 1, date.getDate()].join('/') +
        ' ' +
        date.toLocaleTimeString()
      )
    },
    async fetchVideoSequences(videoId) {
      const sequences = await this.$axios.$get(
        `/api/analytics/sectioning_sequences/${videoId}`
      )
      this.sequences = sequences
      this.sectionSequenceId = null
      this.visualTransitionSequenceId = null
    },
    async onClickStartAnalyze() {
      const data = {
        videoId: this.videos[this.videoIndex].id,
        selectedUsers: this.targets.selectedUsers,
        sectionSequenceId: this.sectionSequenceId,
        visualTransitionSequenceId: this.visualTransitionSequenceId,
        removeMargin: Number(this.removeMargin),
        analyzeName: this.analyzeName
      }

      const result = await this.$axios.$post('/api/analytics/start', data)
      this.resultId = result.resultId
    }
  }
}
</script>
