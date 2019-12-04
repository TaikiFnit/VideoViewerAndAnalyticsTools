<template>
  <section>
    <h2>{{ lesson.title }}</h2>
    <p>{{ lesson.summary }}</p>
    <section v-html="$md.render(lesson.description)" />
    <h3>動画</h3>
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
    console.log(lesson)
    return { lesson, slug }
  }
}
</script>
