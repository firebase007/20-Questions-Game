import Vue from "vue";
import Vuex from "vuex";
// import Axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    messages: [],
    guess: "",
    room: "",
    user: "",
    allUsers: [],
    adminUserEmail: "",
    message: ""
  },
  getters: {
    CHATS: state => {
      return state.chats;
    },
    GUESS: state => {
      return state.guess;
    },
    USERS: state => {
      return state.user;
    },
    MESSAGE: state => {
      return state.message;
    },
    ROOM: state => {
      return state.room;
    }
  },
  mutations: {
    SET_CHAT: (state, payload) => {
      state.chats = payload;
    },
    ADD_CHAT: (state, payload) => {
      state.chats.push(payload);
    },
    SET_GUESS: (state, payload) => {
      state.guess = payload;
    },
    SET_USER: (state, payload) => {
      state.user = payload;
    },
    SET_MESSAGE: (state, payload) => {
      state.message = payload;
    },
    SET_ROOM: (state, payload) => {
      state.room = payload;
    }
  },

  actions: {
    // SET_CHAT: async (context, payload) => {
    // let { data } = await Axios.get("http://localhost:3000/chat");
    // console.log(data, payload);
    // context.commit("SET_CHAT", data);
    // },
    ADD_CHAT: (context, payload) => {
      context.commit("ADD_CHAT", payload);
    },
    SET_GUESS: (context, payload) => {
      context.commit("SET_GUESS", payload);
    },
    SET_USER: (context, payload) => {
      context.commit("SET_USER", payload);
    },
    SET_MESSAGE: (context, payload) => {
      context.commit("SET_MESSAGE", payload);
    },
    SET_ROOM: (context, payload) => {
      context.commit("SET_ROOM", payload);
    }
  }
});
