<template>
  <div>
    <ul>
      <li>
        <nuxt-link to="/analytics">
          分析ツールTOP
        </nuxt-link>
        &gt; 動画のセクショニング
      </li>
    </ul>

    <h1>2. 動画視聴ログ分析</h1>
    <fieldset>
      <legend>2.1 分析に利用したい動画を選択してください</legend>
      <p>
        <select v-model="videoIndex">
          <option v-for="(video, index) in videos" :key="index" :value="index">
            {{ video.id }} : #{{ video.order }} {{ video.title }} -
            {{ video.lessonTitle }}
          </option>
        </select>
      </p>
      <p>
        <small>
          ※
          <nuxt-link to="/analytics/video_markup">
            1. 動画のセクショニング </nuxt-link
          >で画面遷移と動画の解説内容に基づくセクショニングが完了している場合のみ分析が可能です.
        </small>
      </p>
    </fieldset>
    <fieldset v-if="videoIndex !== null">
      <legend>2.2 分析に利用するセクション, 画面遷移を選択してください</legend>
      <p>
        <label
          >2.2.1 定義済みのセクションを選択:
          <select v-model="selected.sectionSequenceId">
            <option
              v-for="(section, index) in sequences.sectionSequences"
              :key="index"
              :value="index"
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
          <select v-model="selected.visualTransitionSequenceId">
            <option
              v-for="(section, index) in sequences.visualTransitionSequences"
              :key="index"
              :value="index"
            >
              {{ section.id }} : {{ section.name }} ({{
                formatDate(section.created_at)
              }})
            </option>
          </select>
        </label>
      </p>
    </fieldset>
    <fieldset v-if="isSelectedSequences">
      <legend>2.3 分析対象を選択してください</legend>
    </fieldset>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videoIndex: null,
      selected: {
        sectionSequenceId: null,
        visualTransitionSequenceId: null
      },
      sequences: {}
    }
  },
  computed: {
    isSelectedSequences() {
      return (
        this.selected.sectionSequenceId !== null &&
        this.selected.visualTransitionSequenceId !== null
      )
    }
  },
  watch: {
    videoIndex(newVideoIndex, oldVideoIndex) {
      const video = this.videos[newVideoIndex]
      this.fetchVideoSequences(video.id)
    }
  },
  async asyncData({ params, error, $axios }) {
    const videos = await $axios.$get('api/videos/analyzable')
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
    }
  }
}
</script>
