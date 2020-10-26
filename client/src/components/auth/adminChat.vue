<template>
  <div class="chat-dashboard">
    <div class="card mt-3">
      <div class="card-body">
        <div class="card-body">
          <div v-if="adminMessage">
            <div class="messages" v-for="(opts, index) in options" :key="index">
              <p>
                <span class="font-weight-bold">{{ opts.user }} </span>
                {{ opts.select }} <span> </span>
              </p>
            </div>
          </div>
          <div v-else>
            {{ selected.user }}: <span> {{ selected.message }}</span>
            <span> {{ new Date() | moment("h:mm a") }} </span>
          </div>
        </div>
      </div>
      <div class="card-footer">
        <form @submit.prevent="sendMessage">
          <section>
            <h3>Is the Guess correct?</h3>
            <input type="radio" v-model="options" name="options" value="Yes" />
            Yes
            <input type="radio" v-model="options" name="options" value="No" />
            No
            <br />
            <button type="submit" class="btn btn-success">Send</button>
          </section>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import getSocket from "../../helpers/socket";
import VueJwtDecode from "vue-jwt-decode";
// const socket = getSocket()

export default {
  name: "Chat",
  data() {
    return {
      user: "",
      messages: [],
      selected: "",
      options: [],
      adminMessage: true,
      message: this.$store.getters.MESSAGE,
    };
  },
  components: {},
  created() {
    console.log(this.options, "state options");
    // this.$store.dispatch('SET_ROOM', this.options.room)
    this.getUserDetails();
    // this.joinRoom()
  },
  methods: {
    getUserDetails() {
      let token = localStorage.getItem("user");
      let decoded = VueJwtDecode.decode(token);
      console.log(decoded, "------------------");
      this.user = decoded;
    },

    sendMessage(e) {
      const socket = getSocket();
      e.preventDefault();
      console.log(
        {
          options: this.options,
          user: this.user,
          adminMessage: this.adminMessage,
        },
        "options"
      );
      this.$store.dispatch("SET_MESSAGE", {
        options: this.options,
        adminMessage: this.adminMessage,
      });
      socket.emit("SEND_MESSAGE", {
        user: this.user.firstname,
        select: this.options,
        adminMessage: this.adminMessage,
      });
      this.options = "";
    },
  },
  mounted() {
    const socket = getSocket();
    socket.on("MESSAGE", (data) => {
      console.log(data, data.room, "-----------jjjj1313");
      socket.emit("join", data.room);
      // localStorage.setItem("roomToJoin", data.room);
      this.options = [...this.options, data];
    });
  },
};
</script>
