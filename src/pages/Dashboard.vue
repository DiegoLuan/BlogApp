<template>
  <div id="dashboard">
    <h2>Minha conta</h2>
    <span>Atualize seu perfil</span>

    <form @submit.prevent="updateProfile">
      <label>Nome:</label>
      <input type="text" v-model="nome" :placeholder="user.nome" id="name" />

      <button class="button" type="submit">Atualizar Perfil</button>
    </form>

    <button class="button logout" @click="signOut">Sair</button>
  </div>
</template>

<script>
import firebase from "../services/firebaseConnection";
export default {
  name: "Dashboard",
  data() {
    return {
      nome: "",
      user: {},
    };
  },
  async created() {
    const userStorage = localStorage.getItem("devPost");
    this.user = JSON.parse(userStorage);
  },
  methods: {
    async signOut() {
      const confirm = window.confirm("Você tem certeza que deseja sair?");
      if (confirm) {
        await firebase
          .auth()
          .signOut()
          .then(() => {
            localStorage.removeItem("devPost");
            this.$router.push("/login");
          });
      } else {
        return;
      }
    },
    async updateProfile() {
      if (this.nome === "") {
        return;
      }

      await firebase.firestore().collection("users").doc(this.user.uid).update({
        nome: this.nome,
      });

      //Atualizando todos os posts do usuário

      //Acessando todas as coleções de posts, onde o post
      const postDocs = await firebase
        .firestore()
        .collection("posts")
        .where("userId", "==", this.user.uid)
        .get();

      //percorrer todos os posts para mudar o nome
      postDocs.forEach(async (doc) => {
        await firebase.firestore().collection("posts").doc(doc.id).update({
          autor: this.nome,
        });
      });

      //Atualizar localStorage
      localStorage.setItem(
        "devPost",
        JSON.stringify({ uid: this.user.uid, nome: this.nome })
      );

      alert("Perfil atualizado com sucesso!");
    },
  },
};
</script>

<style scoped>
#dashboard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 60px;
  padding: 10px 5px;
  width: 600px;
  max-width: 600px;
  background: #4c5059;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

h2 {
  color: #fff;
}

span {
  color: #fff;
  margin-bottom: 25px;
}

form {
  width: 500px;
  display: flex;
  flex-direction: column;
}

form label {
  font-size: 18px;
  color: #fff;
  padding-bottom: 5px;
}

form input {
  height: 30px;
  padding: 5px;
  font-size: 17px;
  outline: none;
  border: 0;
  margin-bottom: 5px;
  background-color: #fafafa;
}

.button {
  cursor: pointer;
  margin-top: 10px;
  height: 35px;
  border: 0;
  background: #7289da;
  color: #fff;
  font-size: 17px;
}

button.logout {
  width: 500px;
  cursor: pointer;
  margin-top: 15px;
  margin-bottom: 20px;
  height: 35px;
  border: 0;
  background: #e36d6d;
  color: #fff;
  font-size: 17px;
}
</style>