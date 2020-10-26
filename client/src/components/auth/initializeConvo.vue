<template>
  <div class="messages">
    <p>
      <span class="font-weight-bold"
        ><span>
          <b>{{ name }}</b
          >, now that the game has started, <b>you can make a guess!!</b> Have
          some fun doing so!!
        </span>
        {{ new Date() | moment("h:mm a") }}
      </span>
    </p>
  </div>
</template>

<script>
export default {
  props: ["name"],
  data() {
    return {};
  },

  methods: {
    created() {
    }
  }
};
</script>

<style></style>
