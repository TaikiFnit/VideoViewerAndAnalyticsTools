<template>
  <section>
    <p>
      <nuxt-link to="/">TOP</nuxt-link>
      &gt; レッスン一覧
    </p>
    <h2>レッスン一覧</h2>
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
