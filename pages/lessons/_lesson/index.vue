<template>
  <section>
    <h1>{{ lesson.title }}</h1>
    <p>{{ lesson.summary }}</p>
    <p>{{ lesson.description }}</p>
  </section>
</template>

<script>
export default {
  async asyncData({ $axios, params }) {
    const lesson = await $axios.$get(`/api/lessons/${params.lesson}`)
    return { lesson }
  }
}
</script>
