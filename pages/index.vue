<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        Fnit-Learning
      </h1>
      <form v-if="!this.$store.state.authUser" @submit.prevent="login">
        <p v-if="formError" class="error">
          {{ formError }}
        </p>
        <p>
          Username: <input v-model="formUsername" type="text" name="username" />
        </p>
        <p>
          Password:
          <input v-model="formPassword" type="password" name="password" />
        </p>
        <button class="button--green" type="submit">
          ログイン
        </button>
      </form>
      <div v-else>
        <p>Hello {{ $store.state.authUser.username }}!</p>
        <p><nuxt-link to="/lessons">レッスン一覧はこちら</nuxt-link></p>
      </div>
    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  data() {
    return {
      formError: null,
      formUsername: '',
      formPassword: ''
    }
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('login', {
          username: this.formUsername,
          password: this.formPassword
        })
        this.formUsername = ''
        this.formPassword = ''
        this.formError = null
      } catch (e) {
        this.formError = e.message
      }
    },
    async logout() {
      try {
        await this.$store.dispatch('logout')
      } catch (e) {
        this.formError = e.message
      }
    }
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 64px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 32px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

p {
  line-height: 2;
}

.error {
  color: red;
}
</style>
