<template>
  <b-navbar id="chat-navbar" toggleable="md" type="dark" variant="info">
    <b-navbar-brand href="#">
      You are currently playing the 20 Questions Game
    </b-navbar-brand>
    <b-navbar-nav class="ml-auto">
      <b-nav-text>{{ user.firstname }} | </b-nav-text>
      <b-nav-item @click="logUserOut" active>Logout</b-nav-item>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import VueJwtDecode from "vue-jwt-decode";

export default {
  data() {
    return {};
  },
  methods: {
    getUserDetails() {
      let token = localStorage.getItem("user");
      let decoded = VueJwtDecode.decode(token);
      console.log(decoded, "------------------");
      this.user = decoded;
    },
    logUserOut() {
      localStorage.removeItem("user");
      this.$router.push("/login");
    }
  },
  created() {
    this.getUserDetails();
  }
};
</script>

<style>
#chat-navbar {
  margin-bottom: 15px;
}
</style>
