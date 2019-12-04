<template>
  <section>
    <h2>{{ video.title }}</h2>
    <p>
      <nuxt-link :to="`/lessons/${lesson.slug}`">
        {{ lesson.title }}
      </nuxt-link>
      &gt; {{ video.title }}
    </p>
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
    },
    // 一時停止した際に発火
    async paused() {
      const time = await this.player.getCurrentTime()
      console.log('paused')
      console.log(time)
    },
    // 再生終了した際に発火
    async ended() {
      const time = await this.player.getCurrentTime()
      console.log('ended')
      console.log(time)
    }
  }
}
</script>
