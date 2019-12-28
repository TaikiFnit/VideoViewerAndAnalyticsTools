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

    <h1>1. 動画のセクショニング</h1>
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
          <dt>動画ID</dt>
          <dd>{{ videos[videoIndex].id }}</dd>
          <dt>動画名</dt>
          <dd>{{ videos[videoIndex].title }}</dd>
          <dt>レッスン名</dt>
          <dd>{{ videos[videoIndex].lessonTitle }}</dd>
        </dl>
      </section>
    </fieldset>
    <fieldset v-if="videoIndex != null">
      <legend>1.2 動画のセクショニング</legend>

      <youtube
        id="player"
        ref="youtube"
        :video-id="videos[videoIndex].youtube_id"
        @playing="playing"
        @paused="paused"
        @ended="ended"
        class="player"
      />

      <p>現在の再生時間: {{ sectioningData.currentTime }}</p>
      <h3>1.2.1 セクションの定義</h3>
      <table>
        <tr>
          <th>開始時間</th>
          <th>終了時間</th>
          <th>セクション名</th>
          <th>Actions</th>
        </tr>
        <tr v-for="(section, index) in sectioningDataSet.section" :key="index">
          <td><input v-model="section.timeFrom" type="number" /></td>
          <td><input v-model="section.timeTo" type="number" /></td>
          <td><input v-model="section.name" type="text" /></td>
          <td>
            <button @click="onClickRemoveSection(index)">
              セクションを削除
            </button>
          </td>
        </tr>
        <tr>
          <td>
            <input v-model="sectioningData.timeFrom" type="number" />
          </td>
          <td>
            <input v-model="sectioningData.timeTo" type="number" />
          </td>
          <td>
            <input v-model="sectioningData.currentSectionName" type="text" />
          </td>
          <button @click="onClickRegisterSection">セクションを登録</button>
        </tr>
      </table>
    </fieldset>
  </div>
</template>

<script>
export default {
  data() {
    return {
      videoIndex: null,
      sectioningData: {
        timeFrom: 0,
        timeTo: null,
        currentTime: 0,
        currentSectionName: 'Section 0'
      },
      sectioningDataSet: {
        visualTransition: [],
        section: []
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
    console.log(videos)
    return { videos }
  },
  methods: {
    onClickRegisterSection() {
      const section = {
        name: this.sectioningData.currentSectionName,
        timeFrom: this.sectioningData.timeFrom,
        timeTo: this.sectioningData.timeTo
      }
      this.sectioningDataSet.section.push(section)
      console.log(this.sectioningDataSet)

      this.sectioningData.currentSectionName = `Section ${this.sectioningDataSet.section.length}`
      const index = this.sectioningDataSet.section.length - 1
      const timeFrom = this.sectioningDataSet.section[index].timeTo
      this.sectioningData.timeFrom = timeFrom
      this.sectioningData.timeTo = null
    },
    onClickRemoveSection(index) {
      if (confirm('Are you sure you want to remove?')) {
        this.sectioningDataSet.section.splice(index, 1)
      }
    },
    // 再生スタートした際に発火
    async playing() {
      const time = await this.player.getCurrentTime()
      console.log(time)
    },
    // 一時停止した際に発火
    async paused() {
      const time = await this.player.getCurrentTime()
      this.sectioningData.currentTime = Math.floor(time)
      this.sectioningData.timeTo = this.sectioningData.currentTime
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
