<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        Fnit-Learning
      </h1>
      <h2 class="subtitle">
        ログインしてね
      </h2>
      <p>Email: <input v-model="formEmail" type="email" name="email" /></p>
      <p>
        Password:
        <input v-model="formPassword" type="password" name="password" />
      </p>
      <button class="button--green">
        ログイン
      </button>
      <button class="button--grey">
        新規登録
      </button>
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
      formEmail: '',
      formPassword: ''
    }
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('login', {
          email: this.formUsername,
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
</style>
