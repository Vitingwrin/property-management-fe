import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const storage = new function () {
  this.get = key => localStorage.getItem(key);
  this.set = (key, value) => { localStorage.setItem(key, value) };
  this.remove = (key) => { localStorage.removeItem(key) };
}();

export default new Vuex.Store({
  state: {
    user: {name: '未登录'}
  },
  getters: {
    isLogin: state => {
      if (state.user == null || state.user.name === '未登录' || state.user.name === '') {
        state.user = JSON.parse(storage.get("user"));
      }
      return state.user != null && state.user.name !== '未登录' && state.user.name !== '';
    },
    isAdmin: state => {
      for (let auth of state.user.authorities) {
        if (auth.authority === 'admin') {
          return true;
        }
      }
      return false;
    }
  },
  mutations: {
    login(state, user) {
      state.user = user;
      storage.set("user", JSON.stringify(user));
    },
    logout(state) {
      state.user = {name: '未登录'};
      storage.set("user", JSON.stringify(state.user));
      storage.remove("user");
    }
  }
});
