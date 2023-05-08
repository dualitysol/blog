import { createStore } from "vuex";
import api from "@/api";
import {
  getLocalUserData,
  getToken,
  storeCredentials,
  clearLocalStorage,
} from "./local";

const userData = getLocalUserData();
const token = getToken();

if (token) {
  api.setToken(token);
}

const store = createStore({
  state: {
    authenticated: !!userData || false,
    userData,
    alerts: new Map(),
  },
  getters: {
    isAuthenticated(state) {
      return state.authenticated;
    },

    userAvatar(state) {
      return state.userData?.avatar;
    },

    actualAlerts(state) {
      return [...state.alerts]
        .filter(([id]) => Date.now() - id < 5000)
        .map(([timestamp, alert]) => ({ ...alert, timestamp }));
    },

    userData(state) {
      return { ...state.userData };
    },
  },
  mutations: {
    authenticate(state, payload = {}) {
      state.authenticated = true;
      state.userData = { ...payload };
    },

    logout(state) {
      clearLocalStorage();
      state.authenticated = false;
      state.userData = {};
    },

    emitAlert(state, { alert, id }) {
      state.alerts.set(id, alert);
    },

    clearAlert(state, id) {
      state.alerts.delete(id);
    },
  },
  actions: {
    emitAlert({ commit }, alert) {
      const id = Date.now();
      commit("emitAlert", { alert, id });
      setTimeout(() => {
        commit("clearAlert", id);
      }, 4000);
    },

    async authenticate({ commit }, { user, token }) {
      if (token) {
        api.setToken(token);
        commit("authenticate", user);
        storeCredentials(token, user);

        return true;
      }

      return false;
    },

    logOut({ commit }) {
      commit("logout");
    },

    /**
     * @param { AxiosError } error
     */
    handleAxiosError(_, { response }) {
      const title = response?.statusText;
      const message = response?.data?.message || "Something went wrong";
      const alert = { title, message, type: "error" };
      this.dispatch("emitAlert", alert);
    },
  },
  modules: {},
});

if (window.Cypress) {
  window.store = store;
  window.$store = store;
}

export default store;
