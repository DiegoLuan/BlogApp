<template>
  <div id="app">
    <Cabecalho />
    <router-view />
  </div>
</template>

<script>
import Cabecalho from "./components/Cabecalho";
export default {
  name: "App",
  components: {
    Cabecalho,
  },
};
</script>

<style scoped>
#app {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
