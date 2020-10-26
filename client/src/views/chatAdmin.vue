<template lang="html">
  <div>
    <b-navbar id="chat-navbar" toggleable="md" type="dark" variant="info">
      <b-navbar-brand href="#">
        You are currently playing the 20 Questions Game
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-text>{{ user.firstname }} | </b-nav-text>
        <b-nav-item @click="logUserOut" active>Logout</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <span slot="activator">
      <p class="grey--text text--darken-2">
        <b class="indigo--text"
          >{{ user.firstname }}, you have guessed the word: {{ guess }}</b
        >
      </p>

      <router-link to="/login?redirect?url=/chat"
        >Now you can share this link to Player 2 to start playing!</router-link
      >

      <div id="app">
        <div class="container">
          <div class="row">
            <div class="col-lg-12 col-md-6 col-md-8">
              <Chat />
            </div>
          </div>
        </div>
      </div>
    </span>
  </div>
</template>

<script>
import VueJwtDecode from "vue-jwt-decode";
import Chat from "../components/auth/adminChat";
export default {
  components: {
    Chat
  },
  data() {
    return {
      guess: this.$store.getters.GUESS
    };
  },
  methods: {
    isMyGuess() {
      const guess = this.$store.getters.GUESS;
      console.log(guess, "guess");
      return guess;
    },

    getUserDetails() {
      let token = localStorage.getItem("user");
      let decoded = VueJwtDecode.decode(token);
      console.log(decoded);
      this.user = decoded;
    },
    logUserOut() {
      localStorage.removeItem("user");
      this.$router.push("/login");
    }
  },
  created() {
    this.isMyGuess(), this.getUserDetails();
  }
};
</script>
