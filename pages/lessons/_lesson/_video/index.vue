<template>
  <section>
    <p>
      <nuxt-link to="/">TOP</nuxt-link>
      &gt;
      <nuxt-link to="/lessons">レッスン一覧</nuxt-link>
      &gt;
      <nuxt-link :to="`/lessons/${lesson.slug}`">
        {{ lesson.title }}
      </nuxt-link>
      &gt; {{ video.title }}
    </p>
    <h2>{{ video.title }}</h2>
    <youtube
      id="player"
      ref="youtube"
      :video-id="video.youtube_id"
      :resize="true"
      @playing="playing"
      @paused="paused"
      @ended="ended"
      class="player"
    />
  </section>
</template>

<script>
export default {
  computed: {
    player() {
      return this.$refs.youtube.player
    }
  },
  async asyncData({ $axios, params }) {
    const slug = params.lesson
    const order = params.video
    const video = await $axios.$get(`/api/lessons/${slug}/${order}`)
    const lesson = await $axios.$get(`/api/lessons/${slug}`)
    return { video, lesson }
  },
  methods: {
    // 再生スタートした際に発火
    async playing() {
      const time = await this.player.getCurrentTime()
      console.log('playing')
      console.log(time)
      this.record_watch_events('START', time)
    },
    // 一時停止した際に発火
    async paused() {
      const time = await this.player.getCurrentTime()
      console.log('paused')
      console.log(time)
      this.record_watch_events('STOP', time)
    },
    // 再生終了した際に発火
    async ended() {
      const time = await this.player.getCurrentTime()
      console.log('ended')
      console.log(time)
      this.record_watch_events('END', time)
    },
    async record_watch_events(type, time) {
      await this.$axios.$post('/api/logs/interaction', {
        type,
        time,
        videoId: this.video.id,
        tempId: this.$store.state.tempId
      })
    }
  }
}
</script>
