<template>
  <div id="app">
    <LotteryGame />
  </div>
</template>

<script>
import LotteryGame from './components/LotteryGame.vue';

export default {
  name: 'App',
  components: {
    LotteryGame
  }
}
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
}
</style>
