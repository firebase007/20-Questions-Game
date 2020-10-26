<template>
  <div class="container">
    <b-card
      bg-variant="dark"
      header="The 20 Questions Game"
      text-variant="white"
      class="text-center"
    >
      <b-card-text
        >Already have an account? Login to begin playing!</b-card-text
      >
      <div class="row">
        <div class="col-lg-6 offset-lg-3 col-sm-10 offset-sm-1">
          <form
            class="text-center border border-primary p-5"
            style="margin-top:70px;height:auto;padding-top:100px !important;"
            @submit.prevent="loginUser"
          >
            <input
              type="text"
              id="email"
              class="form-control mb-5"
              placeholder="Email"
              v-model="login.email"
            />
            <!-- Password -->
            <input
              type="password"
              id="password"
              class="form-control mb-5"
              placeholder="Password"
              v-model="login.password"
            />
            <p>
              Dont have an account? Click
              <router-link to="/register"> here </router-link> to sign up
            </p>
            <!-- Sign in button -->
            <center>
              <button class="btn btn-primary btn-block w-75 my-4" type="submit">
                Sign in
              </button>
            </center>
          </form>
        </div>
      </div>
    </b-card>
  </div>
</template>
<script>
// import getSocket from '../../helpers/socket';
// const socket = getSocket()

export default {
  data() {
    return {
      login: {
        email: "",
        password: ""
      },
      connections: 0
    };
  },
  // created(){
  //   socket.on('connect', (data) => {
  //     this.connect()
  //     });
  // },
  methods: {
    async loginUser() {
      try {
        //  const socket = getSocket()

        // socket.emit('connections', (data) => {
        // console.log(data, '-----d-ddd-dd')
        //   this.connections = data;
        //   localStorage.setItem('adminUser', data);
        // });

        let response = await this.$http.post("/auth/login", this.login);
        console.log(response, "---------response");
        let token = response.data.data.token;

        localStorage.setItem("user", token);

        const url = window.location.search.split("url=")[1];
        console.log(url);

        if (url) {
          window.location.replace(decodeURIComponent(url));
        } else {
          this.$router.push("/");
        }
      } catch (err) {
        console.log(err.response);
      }
    }
  }
};
</script>
