<template>
  <div class="chat-dashboard">
    <div class="card mt-3">
      <div class="card-body">
        <div class="card-body">
          <div v-if="adminMessage">
            <div class="messages" v-for="(opts, index) in options" :key="index">
              <p>
                <span class="font-weight-bold">{{ opts.data.user }} </span>
                <span> {{ opts.data.message }} </span>
                <span> {{ new Date() | moment("h:mm a") }} </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <form @submit.prevent="sendMessage">
          <h3>Is the Guess correct?</h3>
          <select v-model="selected">
            <option disabled value="">Please select one</option>
            <option>Yes</option>
            <option>No</option>
          </select>
          <br />
          <button type="submit" :disabled="clickable" class="btn btn-success">
            Send
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import getSocket from "../../helpers/socket";
import VueJwtDecode from "vue-jwt-decode";

export default {
  name: "Chat",
  data() {
    return {
      user: "",
      messages: [],
      selected: "",
      options: [],
      adminMessage: true,
      message: this.$store.getters.MESSAGE
    };
  },
  components: {},
  created() {
    this.getUserDetails();
  },
  computed: {
    getMessage() {
      return this.$store.getters.MESSAGE;
    },
    clickable() {
      if (!this.options.length || this.options.length === 0) {
        alert(
          `Hey ${this.user.firstname}, allow the player 2 to make a guess before proceeding to confirm!!`
        );
        return true;
      }
      return false;
    }
  },
  methods: {
    getUserDetails() {
      let token = localStorage.getItem("user");
      let decoded = VueJwtDecode.decode(token);
      console.log(decoded, "-----------");
      this.user = decoded;
    },
    sendMessage(e) {
      const socket = getSocket();
      e.preventDefault();
      this.$store.dispatch("SET_MESSAGE", {
        options: this.options,
        adminMessage: this.adminMessage
      });
      socket.emit("SEND_MESSAGE", {
        user: this.user.firstname,
        message: this.selected,
        adminMessage: this.adminMessage
      });
      this.selected = "";
    }
  },
  mounted() {
    const socket = getSocket();
    socket.on("MESSAGE", data => {
      this.options = [...this.options, data];
      console.log(this.options, "check options array");
    });
  }
};
</script>
