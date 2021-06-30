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
    userName: null,
    token: null
  },
  getters: {
    userId: state => state.userId,
    userName: state => state.userName,
    token: state => state.token,
    isLoggedIn: state => state.token !== null
  },
  mutations: {
    updateToken(state, token) {
      state.token = token;
    },
    updateUser(state, user) {
      state.userId = user.user_id;
      state.userName = user.display_name;
    },
    resetData(state) {
      state.token = null;
      state.userId = null;
      state.userName = null;
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
        .then(res => res)
        .catch(err => {
          console.log(err.response);
        })
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
