<template>
      <youtube
        id="player"
        ref="youtube"
        :video-id="videos[videoIndex].youtube_id"
        @playing="playing"
        @paused="paused"
        @ended="ended"
        class="player"
      />
</template>

<script>
export default {
  data() {
    return {
      videoIndex: null,
      sectioningData: {
        currentTime: 0
      },
      sectioningDataSet: {
        visualTransition: [],
        section: []
      }
    }
  },
  async asyncData({ params, error, $axios }) {
    const videos = await $axios.$get('/api/videos')
    console.log(videos)
    return { videos }
  },
  methods: {
    // 再生スタートした際に発火
    async playing() {
      const time = await this.player.getCurrentTime()
      console.log(time)
    },
    // 一時停止した際に発火
    async paused() {
      const time = await this.player.getCurrentTime()
      console.log(time)
    },
    // 再生終了した際に発火
    async ended() {
      const time = await this.player.getCurrentTime()
      console.log(time)
    }
  }
}
</script>
