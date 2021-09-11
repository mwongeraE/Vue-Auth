import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import querystring from 'querystring'
import router from './router.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null, 
  },
  mutations: {
    authUser (state, userData) {
      state.token = userData.token
    },
    clearAuth (state) {
      state.token= null
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
      axios.request({
        method: 'POST',
        url: 'http://20.54.248.198:8080/auth/realms/crs/protocol/openid-connect/token',
        headers: {'content-type': 'application/x-www-form-urlencoded'},
        data: querystring.stringify({
          grant_type: 'password',
          client_id: 'birth-registration-portal',
          username: authData.username,
          password: authData.password
        })
      })
        .then(res => {
          console.log("Access Token " + res.data.access_token)
          console.log("Refresh Token " + res.data.refresh_token)
          localStorage.setItem('token', res.data.access_token)
          
          // localStorage.setItem('userId', res.data.localId)
          commit('authUser', {
            token: res.data.access_token,
  
          })
          console.log(this.state.token)
          router.push("/dashboard")
        })
        .catch(error => console.log(error))
    },
    logout ({commit}) {
      commit('clearAuth')
      localStorage.removeItem('token')
      router.replace('/signin')
    },
    AutoLogin ({commit}) {
      const token = localStorage.getItem('token')
      if (!token) {
        return
      }
      commit('authUser', {
        token: token,
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
      return state.access_token !== null
    }
  }
})
