<template>
  <div class="chat-dashboard">
    <ChatNavBar></ChatNavBar>
    <div class="card mt-3">
      <div class="card-body">
        <div class="card-body">
          <span> <b>Guess Count: </b>{{ countdown }} </span>
          <initializeConvo :name="this.user.firstname" />

          <div class="messages" v-for="msg in messages" :key="msg.message">
            <p>
              <span class="font-weight-bold">{{ msg.data.user }}: </span>
              <span v-if="msg.data.message === 'Yes'">
                Hey, the game has ended as you have made the correct
                guess...!!!CONGRATULATIONS!!!
              </span>
              <span v-else> {{ msg.data.message }} : </span>
              <span> {{ new Date() | moment("h:mm a") }} </span>
            </p>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <form @submit.prevent="sendMessage">
          <div class="gorm-group pb-3">
            <label for="message"><h4>Enter a Guess:</h4></label>
            <input
              type="text"
              v-model="message"
              placeholder="Enter a guess..."
              class="form-control"
            />
          </div>

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
import ChatNavBar from "./ChatNavBar.vue";
import VueJwtDecode from "vue-jwt-decode";
import initializeConvo from "./initializeConvo";
const socket = getSocket();

export default {
  name: "Chat",
  data() {
    return {
      user: "",
      message: "",
      messages: this.$store.getters.MESSAGE,
      adminMessage: false,
      countdown: Number(20),
      room: this.$store.getters.ROOM
    };
  },
  components: {
    ChatNavBar,
    initializeConvo
  },
  created() {
    this.getUserDetails();
    this.messages = this.$store.getters.MESSAGE;
  },
  methods: {
    getUserDetails() {
      let token = localStorage.getItem("user");
      let decoded = VueJwtDecode.decode(token);
      console.log(decoded, "-----------");
      this.user = decoded;
    },
    checkAdminResponse() {
      if (this.messages.data.message === "Yes") {
        alert(
          `Hey ${this.user.firstname}, the game has ended as you have made the correct guess...!!!CONGRATULATIONS!!!`
        );
        return true;
      }
      return false;
    },

    sendMessage(e) {
      e.preventDefault();
      this.$store.dispatch("SET_MESSAGE", {
        messages: this.messages,
        adminMessage: this.adminMessage
      });
      socket.emit("SEND_MESSAGE", {
        user: this.user.firstname,
        message: this.message,
        adminMessage: this.adminMessage,
        created: Date.now()
      });
      this.message = "";
      this.countdown--;
    }
  },
  mounted() {
    const socket = getSocket();
    socket.on("MESSAGE", data => {
      this.messages = [...this.messages, data];
    });
  },
  computed: {
    clickable() {
      // if something
      console.log(this.messages, "messages");
      if (this.countdown === 0) {
        alert(
          `Hey ${this.user.firstname}, the game has ended and you have not made the correct guess!!!`
        );
        return true;
      }
      if (this.messages && this.messages.length) {
        // for (let msg in this.messages) {
        //   console.log(msg, this.messages, "olololoil");
        // if (msg.data.message === "Yes") {
        //   alert(
        //     `Hey ${this.user.firstname}, the game has ended as you have made the correct guess...!!!CONGRATULATIONS!!!`
        //   );
        //   return true;
        // }
        // }
      }

      return false;
    }
  }
};
</script>
