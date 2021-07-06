import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import axios from '@/axios-for-auth'

interface IHeader {
  "Content-Type": string;
  "Authorization"?: string;
}

const store = createStore({
  state: {
    userId: null,
    displayName: null,
    token: null,
    rememberRoot: '/'
  },
  getters: {
    userId: state => state.userId,
    displayName: state => state.displayName,
    token: state => state.token,
    isLoggedIn: state => state.token !== null
  },
  mutations: {
    updateToken(state, token) {
      state.token = token;
    },
    updateUser(state, user) {
      state.userId = user.user_id;
      state.displayName = user.display_name;
    },
    resetData(state) {
      state.token = null;
      state.userId = null;
      state.displayName = null;
    }
  },
  actions: {
    updateData({ commit }, data) {
      commit('updateToken', data.token)
      commit('updateUser', data.user)
    },
    resetData({ commit }) {
      commit('resetData')
    },
    async request ({ rootState }, { method, url, data }) {
      const headers: IHeader = {
        'Content-Type': 'application/json'
      };
      if (rootState.token !== null) {
        headers['Authorization'] = `bearer${rootState.token}`
      }

      const options = {
        method,
        url,
        headers,
        data,
        timeout: 15000
      }

      return axios(options)
    }
  },
  plugins: [
    createPersistedState({
      key: 'oogiri',
      storage: window.sessionStorage
    })
  ]
})

export default store;
