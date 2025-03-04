export const state = () => ({
  authUser: null,
  tempId: null
})

export const mutations = {
  SET_USER(state, user) {
    state.authUser = user
  },
  SET_TEMP_ID(state, tempId) {
    state.tempId = tempId
  }
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtServerInit({ commit }, { req }) {
    if (req.session && req.session.authUser) {
      commit('SET_USER', req.session.authUser)
    }
  },
  async login({ commit }, { username, password }) {
    try {
      const data = await this.$axios.$post('/api/login', {
        username,
        password
      })
      commit('SET_USER', data)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error('Bad credentials')
      }
      throw error
    }
  },

  async logout({ commit }) {
    await this.$axios.$post('/api/logout')
    commit('SET_USER', null)
  },

  storeTempId({ commit }, { tempId }) {
    commit('SET_TEMP_ID', tempId)
  }
}
