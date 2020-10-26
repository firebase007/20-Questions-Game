<template>
  <div>
    <b-navbar id="chat-navbar" toggleable="md" type="dark" variant="info">
      <b-navbar-brand href="#">
        Welcome to 20 the Questions Game
      </b-navbar-brand>
      <b-navbar-nav class="ml-auto">
        <b-nav-text>{{ user.firstname }} | </b-nav-text>
        <b-nav-item @click="logUserOut" active>Logout</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
    <section>
      <div class="container" id="text">
        <b-card-text
          >Guess any generic word, for example <b>Animal</b>, Now start
          playing!!!</b-card-text
        >
        <div class="row" id="text">
          <div class="col-lg-6 offset-lg-3 col-sm-10 offset-sm-1">
            <form
              class="text-center border border-primary p-5"
              style="margin-top:70px;height:auto;padding-top:100px !important;"
              @submit.prevent="submitGuess"
            >
              <input
                type="guess"
                id="guess"
                class="form-control mb-5"
                placeholder="guess a word"
                v-model="submit.guess"
              />

              <center>
                <button
                  large
                  @click="submitGuess"
                  class="btn btn-primary btn-block w-75 my-4"
                >
                  Start Game!
                </button>
              </center>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import VueJwtDecode from "vue-jwt-decode";
// import getSocket from "../helpers/socket";
// const socket = getSocket();

export default {
  data() {
    return {
      submit: {
        guess: ""
      },
      adminMessage: true
    };
  },
  methods: {
    getUserDetails() {
      let token = localStorage.getItem("user");
      let decoded = VueJwtDecode.decode(token);
      console.log(decoded)
      this.user = decoded;
    },

    submitGuess(e) {
      e.preventDefault();
      console.log(this.user.email, this.submit.guess);
      this.$store.dispatch("SET_GUESS", this.submit.guess);
      this.$router.push("/chat/player1");
      // socket.emit("create", "room1this");
    },
    logUserOut() {
      localStorage.removeItem("user");
      this.$router.push("/login");
    }
  },
  created() {
    this.getUserDetails();
  },
  mounted() {}
};
</script>

<style>
#chat-navbar {
  margin-bottom: 55px;
}
</style>
