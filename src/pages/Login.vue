<template>
  <div id="login">
    <div v-if="login" class="loginArea">
      <h1>Entrar</h1>
      <form @submit.prevent="handleLogin">
        <input type="text" placeholder="E-mail" v-model="email" />
        <input type="password" placeholder="Senha" v-model="password" />
        <button type="submit">Acessar</button>
      </form>
      <a @click="toggleBtn">Criar uma conta</a>
    </div>

    <div v-else class="loginArea">
      <h1>Cadastrar</h1>
      <form @submit.prevent="handleRegister">
        <input type="text" placeholder="Nome" v-model="nome" />
        <input type="text" placeholder="E-mail" v-model="email" />
        <input type="password" placeholder="Senha" v-model="password" />
        <button type="submit">cadastrar</button>
        <a @click="toggleBtn">Já possuo uma conta!</a>
      </form>
    </div>
  </div>
</template>

<script>
import firebase from "../services/firebaseConnection";
export default {
  name: "Login",
  data() {
    return {
      nome: "",
      email: "",
      password: "",
      login: true,
    };
  },
  methods: {
    toggleBtn() {
      this.login = !this.login;
      this.nome = "";
      this.email = "";
      this.password = "";
    },
    async handleRegister() {
      const { user } = await firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password);

      console.log(user);

      await firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .set({
          nome: this.nome,
        })
        .then(async () => {
          const usuarioLogado = {
            uid: user.uid,
            nome: this.nome,
          };

          localStorage.setItem("devPost", JSON.stringify(usuarioLogado));
        })
        .catch(() => {
          console.log("Error ao cadastrar!");
        });

      this.$router.push("/");
    },
    async handleLogin() {
      //se conseguir logar, tem um usuário
      const { user } = await firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password);

      //buscar nome do usuário
      const userProfile = await firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get();

      const usuarioLogado = {
        uid: user.uid,
        nome: userProfile.data().nome,
      };

      await localStorage.setItem("devPost", JSON.stringify(usuarioLogado));

      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  color: #fff;
}

.loginArea {
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 20px;
  margin-top: 65px;
  max-width: 600px;
  background: #4c5059;
  border-radius: 10px;
}

form {
  display: flex;
  flex-direction: column;
  margin: 0px 25px;
}

input {
  margin-bottom: 10px;
  height: 20px;
  width: 300px;
  font-size: 15px;
  padding: 10px;
  outline: none;
  border: 0;
  background: rgb(241, 241, 241);
}

button {
  height: 35px;
  border: 0;
  background-color: #7289da;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  outline: none;
  cursor: pointer;
}

.loginArea a {
  margin-top: 20px;
  text-decoration: none;
  color: #fff;
  cursor: pointer;
  text-align: center;
}
</style>