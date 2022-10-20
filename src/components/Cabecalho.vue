<template>
  <header id="cabecalho">
    <router-link to="/">SujeitoPost</router-link>
    <router-link tag="button" to="/dashboard">Dashboard</router-link>
  </header>
</template>

<script>
export default {
  name: "Cabecalho",
};
</script>

<style scoped>
#cabecalho {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 60px;
  background-color: #202225;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

#cabecalho a {
  text-decoration: none;
  font-size: 25px;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
}

#cabecalho a:hover {
  font-size: 26px;
}

button {
  cursor: pointer;
  border: 0;
  color: #fff;
  background: transparent;
  padding: 5px 15px;
  outline: none;
  font-weight: bold;
  transition: all 0.3s;
}

button:hover {
  font-size: 14px;
}
</style>