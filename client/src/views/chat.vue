<template>
  <div id="app">
    <div class="container">
      <div class="row">
        <div class="col-lg-12 col-md-6 col-md-8">
          <Chat />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Chat from '../components/auth/chat'
export default {
  name: 'app',
  components: {
    Chat
  }
}
</script>

<style>
</style>