<template>
  <section>
    <p>
      <nuxt-link to="/">TOP</nuxt-link>
      &gt;
      <nuxt-link to="/lessons">レッスン一覧</nuxt-link>
      &gt; {{ lesson.title }}
    </p>
    <h2>{{ lesson.title }}</h2>
    <p>{{ lesson.summary }}</p>
    <section v-html="$md.render(lesson.description)" />
    <h3>動画</h3>
    <p v-if="lesson.videos.length === 0">準備中</p>
    <ol>
      <li v-for="video in lesson.videos">
        <h4>
          <nuxt-link :to="`/lessons/${slug}/${video.order}`">
            {{ video.title }}
          </nuxt-link>
        </h4>
        <div v-html="$md.render(video.summary)" />
      </li>
    </ol>
  </section>
</template>

<script>
export default {
  async asyncData({ $axios, params }) {
    const slug = params.lesson
    const lesson = await $axios.$get(`/api/lessons/${slug}`)
    return { lesson, slug }
  }
}
</script>
