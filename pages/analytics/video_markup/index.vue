<template>
  <section>
    <p>
      <nuxt-link to="/">TOP</nuxt-link>
      &gt;
      <nuxt-link to="/analytics">
        分析ツール TOP
      </nuxt-link>
      &gt; 動画構成入力機能
    </p>

    <h2>1. 動画構成入力機能</h2>
    <fieldset>
      <legend>1.1 分析に利用したい動画を選択してください</legend>
      <select v-model="videoIndex">
        <option v-for="(video, index) in videos" :key="index" :value="index">
          {{ video.id }} : #{{ video.order }} {{ video.title }} -
          {{ video.lessonTitle }}
        </option>
      </select>
      <section v-if="videoIndex != null">
        <h3>選択した動画について</h3>
        <dl>
          <dt>動画ID:</dt>
          <dd>{{ videos[videoIndex].id }}</dd>
          <dt>動画名:</dt>
          <dd>{{ videos[videoIndex].title }}</dd>
          <dt>レッスン名:</dt>
          <dd>{{ videos[videoIndex].lessonTitle }}</dd>
        </dl>
      </section>
    </fieldset>
    <fieldset v-if="videoIndex != null">
      <legend>1.2 動画構成の入力</legend>

      <youtube
        id="player"
        ref="youtube"
        :video-id="videos[videoIndex].youtube_id"
        @playing="playing"
        @paused="paused"
        @ended="ended"
        class="player"
      />

      <p>現在の再生時間: {{ currentTime }}</p>
      <section>
        <h3>1.2.1 動画の解説内容・作業工程に基づくセクションの定義</h3>
        <table>
          <tr>
            <th>開始時間</th>
            <th>終了時間</th>
            <th>セクション名</th>
            <th>Actions</th>
          </tr>

          <!-- 出力行 -->
          <tr v-for="(section, index) in dataSet.sections" :key="index">
            <td>
              <input
                v-if="completed.sections === false"
                v-model="section.timeFrom"
                type="number"
              />
              <p v-else>{{ section.timeFrom }}</p>
            </td>
            <td>
              <input
                v-if="completed.sections === false"
                v-model="section.timeTo"
                type="number"
              />
              <p v-else>{{ section.timeTo }}</p>
            </td>
            <td>
              <input
                v-if="completed.sections === false"
                v-model="section.name"
                type="text"
              />
              <p v-else>{{ section.name }}</p>
            </td>
            <td>
              <button
                @click="onClickRemoveSection(index, 'sections')"
                v-if="completed.sections === false"
              >
                セクションを削除
              </button>
            </td>
          </tr>

          <!-- 入力行 -->
          <tr v-if="completed.sections === false">
            <td>
              <input v-model="formData.sections.timeFrom" type="number" />
            </td>
            <td>
              <input v-model="formData.sections.timeTo" type="number" />
            </td>
            <td>
              <input v-model="formData.sections.name" type="text" />
            </td>
            <button @click="onClickRegisterSection('sections')">
              セクションを登録
            </button>
          </tr>
        </table>

        <button
          @click="onClickSectionRegistrationCompleted('sections')"
          v-if="completed.sections === false"
        >
          セクション入力を完了する
        </button>
      </section>

      <section>
        <h3>1.2.2 画面遷移発生時点の入力</h3>
        <table>
          <tr>
            <th>開始時間</th>
            <th>終了時間</th>
            <th>画面名</th>
            <th>Actions</th>
          </tr>

          <!-- 出力行 -->
          <tr
            v-for="(visualTransition, index) in dataSet.visualTransitions"
            :key="index"
          >
            <td>
              <input
                v-if="completed.visualTransitions === false"
                v-model="visualTransition.timeFrom"
                type="number"
              />
              <p v-else>{{ visualTransition.timeFrom }}</p>
            </td>
            <td>
              <input
                v-if="completed.visualTransitions === false"
                v-model="visualTransition.timeTo"
                type="number"
              />
              <p v-else>{{ visualTransition.timeTo }}</p>
            </td>
            <td>
              <input
                v-if="completed.visualTransitions === false"
                v-model="visualTransition.name"
                type="text"
              />
              <p v-else>{{ visualTransition.name }}</p>
            </td>
            <td>
              <button
                @click="onClickRemoveSection(index, 'visualTransitions')"
                v-if="completed.visualTransitions === false"
              >
                画面を削除
              </button>
            </td>
          </tr>

          <!-- 入力行 -->
          <tr v-if="completed.visualTransitions === false">
            <td>
              <input
                v-model="formData.visualTransitions.timeFrom"
                type="number"
              />
            </td>
            <td>
              <input
                v-model="formData.visualTransitions.timeTo"
                type="number"
              />
            </td>
            <td>
              <input v-model="formData.visualTransitions.name" type="text" />
            </td>
            <button @click="onClickRegisterSection('visualTransitions')">
              画面を登録
            </button>
          </tr>
        </table>

        <button
          @click="onClickSectionRegistrationCompleted('visualTransitions')"
          v-if="completed.visualTransitions === false"
        >
          画面入力を完了する
        </button>
      </section>
    </fieldset>
  </section>
</template>

<script>
export default {
  data() {
    return {
      videoIndex: null,
      currentTime: 0,
      completed: {
        sections: false,
        visualTransitions: false
      },
      formData: {
        sections: {
          timeFrom: 0,
          timeTo: null,
          name: 'セクション 0'
        },
        visualTransitions: {
          timeFrom: 0,
          timeTo: null,
          name: '画面 0'
        }
      },
      dataSet: {
        visualTransitions: [],
        sections: []
      }
    }
  },
  computed: {
    player() {
      return this.$refs.youtube.player
    }
  },
  async asyncData({ params, error, $axios }) {
    const videos = await $axios.$get('/api/videos')
    return { videos }
  },
  methods: {
    onClickRegisterSection(type) {
      const section = {
        name: this.formData[type].name,
        timeFrom: parseInt(this.formData[type].timeFrom),
        timeTo: parseInt(this.formData[type].timeTo)
      }
      this.dataSet[type].push(section)

      // データの初期化
      this.formData[type].name = `${
        type === 'sections' ? 'セクション' : '画面'
      } ${this.dataSet[type].length}`
      const index = this.dataSet[type].length - 1
      const timeFrom = this.dataSet[type][index].timeTo
      this.formData[type].timeFrom = timeFrom
      this.formData[type].timeTo = null
    },
    onClickRemoveSection(index, type) {
      if (confirm('Are you sure you want to remove?')) {
        this.dataSet[type].splice(index, 1)
      }
    },
    async onClickSectionRegistrationCompleted(type) {
      const name = prompt('識別のための名前をつけてください')
      if (name === null) {
        return
      }

      this.dataSet[type].forEach((section, index) => {
        section.timeFrom = parseInt(section.timeFrom)
        section.timeTo = parseInt(section.timeTo)
        section.time_order = index
      })

      const data = {
        sections: this.dataSet[type],
        videoId: this.videos[this.videoIndex].id,
        name,
        type
      }

      await this.$axios.$post('/api/analytics/sectioning', data)

      this.completed[type] = true
    },
    async onClickVisualTransitionSectionRegistrationCompleted() {},
    // 再生スタートした際に発火
    async playing() {
      // const time = await this.player.getCurrentTime()
    },
    // 一時停止した際に発火
    async paused() {
      const time = await this.player.getCurrentTime()
      this.currentTime = Math.floor(time)
      this.formData.sections.timeTo = this.currentTime
      this.formData.visualTransitions.timeTo = this.currentTime
    },
    // 再生終了した際に発火
    async ended() {
      // const time = await this.player.getCurrentTime()
    }
  }
}
</script>
