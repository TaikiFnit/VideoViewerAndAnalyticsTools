<template>
  <div class="container">
    <section>
      <h1 v-if="error.statusCode === 404">ページが見つかりません</h1>
      <h1 v-else-if>{{ error.message }}</h1>
      <p><nuxt-link to="/">トップへ戻る</nuxt-link></p>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    error: {
      type: Object,
      required: true
    }
  }
}
</script>
