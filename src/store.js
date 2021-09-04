import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from './router.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    idToken: null,
    userId: null,
    user: null
  },
  mutations: {
    authUser (state, userData) {
      state.idToken = userData.token
      state.userId = userData.userId
    },
    clearAuth (state) {
      state.idToken = null
      state.userId = null
    }
  },
  actions: {
    signup ({commit}, authData) {
      axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[API-KEY]', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(res => {
          console.log(res)
           localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId
          })
        
          router.push("/dashboard")
        })
        .catch(error => console.log(error))
    },
    login ({commit}, authData) {
      axios.post('https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=[API-KEY]', {
        email: authData.email,
        password: authData.password,
        returnSecureToken: true
      })
        .then(res => {
          console.log(res)
          localStorage.setItem('token', res.data.idToken)
          localStorage.setItem('userId', res.data.localId)
          commit('authUser', {
            token: res.data.idToken,
            userId: res.data.localId
          })
          router.push("/dashboard")
        })
        .catch(error => console.log(error))
    },
    logout ({commit}) {
      commit('clearAuth')
      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      router.replace('/')
    },
    AutoLogin ({commit}) {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }
      const userId = localStorage.getItem('userId')
      commit('authUser', {
        token: token,
        userId: userId
      })
    }
  },
  /*
  var axios = require("axios").default;

var options = {
  method: 'POST',
  url: 'https://YOUR_DOMAIN/oauth/token',
  headers: {'content-type': 'application/x-www-form-urlencoded'},
  data: {
    grant_type: 'client_credentials',
    client_id: 'YOUR_CLIENT_ID',
    client_secret: 'YOUR_CLIENT_SECRET',
    audience: 'YOUR_API_IDENTIFIER'
  }
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});
**/
  getters: {
    user (state) {
      return state.user
    },
    ifAuthenticated (state) {
      return state.idToken !== null
    }
  }
})
