<template>
  <section>
    <h1>レッスン一覧</h1>
    <ul>
      <li v-for="lesson in lessons">
        <section>
          <h3>
            <nuxt-link :to="`/lessons/${lesson.slug}`">
              {{ lesson.title }}
            </nuxt-link>
          </h3>
          <p>{{ lesson.summary }}</p>
        </section>
      </li>
    </ul>
  </section>
</template>

<script>
export default {
  async asyncData({ $axios }) {
    const lessons = await $axios.$get('/api/lessons')
    return { lessons }
  }
}
</script>
