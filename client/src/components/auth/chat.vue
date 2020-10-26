<template>
  <div class="chat-dashboard">
    <ChatNavBar></ChatNavBar>
    <div class="card mt-3">
      <div class="card-body">
          <div class="card-body">
            <initializeConvo :name="this.user.firstname"/>
            
              <div class="messages" v-for="(msg, index) in messages" :key="index">

                  <p><span class="font-weight-bold">{{ msg.user }}: </span>{{ msg.message }}  : <span> {{new Date() | moment("h:mm a") }} </span></p>
                  <!-- <span>{{ msg.message }}</span> -->
              </div>
          </div>
      </div>
      <div class="card-footer">
          <form @submit.prevent="sendMessage">
          
              <div class="gorm-group pb-3">
                  <label for="message"><h4>Enter a Guess: </h4></label>
                  <input type="text" v-model="message" placeholder="Enter a guess..." class="form-control">
              </div>
              
  
              <button type="submit" class="btn btn-success">Send</button>
          </form>
      </div>
  </div>
  </div>
</template>

<script>
import getSocket from '../../helpers/socket';
import ChatNavBar from './ChatNavBar.vue';
import VueJwtDecode from "vue-jwt-decode";
import initializeConvo from "./initializeConvo";
const socket = getSocket()

export default {
 
  name: 'Chat',
  data() {
        return {
            user: '',
            message: '',
            messages: [],
            adminMessage: false,
            // message: this.$store.getters.MESSAGE,
            room: this.$store.getters.ROOM,

        }
    },
  components: {
    ChatNavBar,
    initializeConvo,
  },
  created() {
    console.log(this.message, 'message00000000')
    console.log(this.messages, 'room')
    this.getUserDetails()
  //   this.joinRoom()
  },
  methods: {
    getUserDetails() {
      let token = localStorage.getItem("user");
      let decoded = VueJwtDecode.decode(token);
      console.log(decoded, '------------------')
      this.user = decoded;
    },
//     joinRoom() {
//     const room = this.room
//     console.log(room, 'testrttr')
//     socket.emit('join', {room: room});
// },
        sendMessage(e) {
           e.preventDefault();
          // const socket = getSocket()
          this.$store.dispatch("SET_MESSAGE", {options: this.options, adminMessage: this.adminMessage});
            socket.emit('SEND_MESSAGE', {
                user: this.user.firstname,
                message: this.message,
                adminMessage: this.adminMessage,
                created: Date.now()
            });
            this.message = ''
        }
    },
    mounted() {
      const socket = getSocket()
       socket.on('MESSAGE', (data) => {
         console.log(data, '222', [...this.messages, data], this.messages.length, this.messages)
          this.messages = [...this.messages, data];
        });
    }
}
</script>