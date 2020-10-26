<template>
  <div class="message-form">
    <b-form @submit.prevent="onSubmit">
      <b-form-input
        id="message-input"
        type="text"
        v-model="message"
        placeholder="Guess the word..."
        autocomplete="off"
        required
      >
      </b-form-input>

      <b-button type="submit" variant="primary">
        Send
      </b-button>
    </b-form>
  </div>
</template>

<script>
import VueJwtDecode from "vue-jwt-decode";
export default {
  name: "messageForm",
  data() {
    return {
      message: ""
    };
  },

  methods: {
    getUserDetails() {
      let token = localStorage.getItem("user");
      let decoded = VueJwtDecode.decode(token);
      console.log(decoded);
      this.user = decoded;
    },
    submitMessage(event) {
      // If the message body is empty, do not submit
      if (event.target.value.length === 0) {
        return;
      }
      if (!event.shiftKey) {
        event.preventDefault();
      } else {
        return;
      }
    },
    async onSubmit() {
      const result = await this.submitMessage(this.message);
      console.log(result);
      if (result) {
        this.message = "";
      }
    }
  },

  created() {
    console.log("got here");
    this.getUserDetails();
  }
};
</script>
