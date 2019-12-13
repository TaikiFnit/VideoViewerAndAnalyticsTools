<template>
  <div>
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
      <h2>#{{ video.order }} {{ video.title }}</h2>
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
      <div class="button-group">
        <nuxt-link
          v-if="video.order > 1"
          :to="`/lessons/${lesson.slug}/${video.order - 1}`"
        >
          <button class="button--grey">&lt;&lt; 前の動画へ</button>
        </nuxt-link>
        <button
          v-if="learningLog && learningLog.status == true"
          @click="onClickLearningCompleted(false)"
          class="button--green"
        >
          未完了に戻す
        </button>
        <button
          v-else
          @click="onClickLearningCompleted(true)"
          class="button--green"
        >
          学習完了
        </button>
        <nuxt-link
          v-if="video.order < lesson.videos.length"
          :to="`/lessons/${lesson.slug}/${video.order + 1}`"
        >
          <button class="button--grey">次の動画へ &gt;&gt;</button>
        </nuxt-link>
      </div>
      <section v-if="learningLog && learningLog.status == true">
        <h3>学習のつまずきに関するアンケート</h3>
        <form @submit.prevent="submitFeedback">
          <p>
            この動画の学習を終えて学習や作業につまずいた点や理解が難しかった点,
            または動画通りにうまく行かなかった点を教えてください.
            (あればあるだけ.)
          </p>
          <p>
            記入する際は
            具体的に動画内の何秒時点のどこにつまずいたかを書いてもらえるとありがたいです.
            (記入する内容はどんなに小さなことやささいなつまずき等でも構いません)
          </p>
          <p>
            記入例:
            1.動画内0:23-0:45のウェブサイトの解説でウェブサイトを探すのに手間取った,
            2.動画内2:00-3:00のプログラムの意味を理解することができなかった.
            など
          </p>
          <div>
            <textarea
              id="feedbackForm"
              v-model="feedbackForm"
              name="feedbackForm"
              cols="124"
              rows="25"
            ></textarea>
          </div>
          <button class="button--green" type="submit">送信する</button>
          <p>
            ※アンケートは何度でも送信できます.
            つまずき等が発生しだい逐次送ってもらう形でも大丈夫です.
          </p>
        </form>
      </section>
    </section>
    <aside>
      <h3>動画一覧</h3>
      <ol>
        <li v-for="video in lesson.videos">
          <h4>
            <nuxt-link :to="`/lessons/${lesson.slug}/${video.order}`">
              {{ video.title }}
            </nuxt-link>
          </h4>
        </li>
      </ol>
    </aside>
  </div>
</template>

<script>
export default {
  middleware: 'auth',
  data() {
    return {
      feedbackForm: ''
    }
  },
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
    const learningLog = await $axios.$get(`/api/logs/learning/${video.id}`)

    return { video, lesson, learningLog }
  },
  methods: {
    // 再生スタートした際に発火
    async playing() {
      const time = await this.player.getCurrentTime()
      this.record_watch_events('START', time)
    },
    // 一時停止した際に発火
    async paused() {
      const time = await this.player.getCurrentTime()
      this.record_watch_events('STOP', time)
    },
    // 再生終了した際に発火
    async ended() {
      const time = await this.player.getCurrentTime()
      this.record_watch_events('END', time)
    },
    async record_watch_events(type, time) {
      await this.$axios.$post('/api/logs/interaction', {
        type,
        time,
        videoId: this.video.id,
        tempId: this.$store.state.tempId
      })
    },
    async onClickLearningCompleted(status) {
      await this.$axios.$post('/api/logs/learning', {
        videoId: this.video.id,
        status
      })
      const learningLog = await this.$axios.$get(
        `/api/logs/learning/${this.video.id}`
      )
      this.learningLog = learningLog
    },
    async submitFeedback() {
      await this.$axios.$post('/api/logs/feedback', {
        feedback: this.feedbackForm,
        videoId: this.video.id,
        tempId: this.$store.state.tempId
      })

      alert('送信完了. Thanks!')
      this.feedbackForm = ''
    }
  }
}
</script>
