<template>
  <div id="home">
    <div class="newpost">
      <h2>Bem vindo de volta</h2>
      <span>Compartilhe seu dia</span>
      <textarea
        placeholder="O que está fazendo hoje?"
        rows="15"
        v-model="post"
      ></textarea>
      <button @click="registerPost">Compartilhar</button>
    </div>

    <div v-if="loading" class="postarea d-flex">
      <div class="loading"></div>
    </div>

    <div v-else class="postarea">
      <article v-if="this.posts.length <= 0" class="post">
        <h1>Nenhum post foi registrado.. :)</h1>
      </article>
      <!-- post -->
      <article v-else v-for="(post, index) in posts" :key="index" class="post">
        <router-link tag="h1" :to="`/perfil/${post.userId}`">
          {{ post.nome }}
        </router-link>
        <p>
          {{ post.content | postLength }}
        </p>

        <div class="action-post">
          <button @click="enjoy(post.id, post.likes)">
            {{ post.likes === 0 ? "Curtir" : post.likes + " curtidas" }}
          </button>
          <button @click="modalPost(post)">Veja post completo</button>
          <button @click="deletePost(post.id, post.nome)">
            {{ post.nome === user.nome ? "Excluir" : "" }}
          </button>
        </div>
      </article>
      <!-- /post -->
    </div>

    <Modal v-if="showModal" :post="fullPost" @close="modalPost()"> </Modal>
  </div>
</template>

<script>
import firebase from "../services/firebaseConnection";
import Modal from "@/components/Modal";
export default {
  name: "Home",
  components: {
    Modal,
  },
  data() {
    return {
      post: "",
      user: {},
      posts: [],
      loading: true,
      showModal: false,
      fullPost: {},
    };
  },

  //-----CREATED-----//
  async created() {
    const userStorage = localStorage.getItem("devPost");
    this.user = JSON.parse(userStorage);

    await firebase
      .firestore()
      .collection("posts")
      .orderBy("created", "desc") //ordernar a lista, 1º parametro ordernar por qual atributo da lista, e o outro crescente ou decrescente.
      .onSnapshot((doc) => {
        this.posts = [];
        doc.forEach((item) => {
          this.posts.push({
            id: item.id,
            nome: item.data().autor,
            content: item.data().content,
            likes: item.data().likes,
            created: item.data().created,
            userId: item.data().userId,
          });
        });

        this.loading = false;

        console.log(this.user.nome);
      });
  },

  //------METHODS-----//
  methods: {
    async registerPost() {
      if (this.post === "") {
        return;
      }

      await firebase
        .firestore()
        .collection("posts")
        .add({
          created: new Date(), // data em que o post foi criado
          content: this.post,
          autor: this.user.nome,
          userId: this.user.uid,
          likes: 0,
        })
        .then((response) => {
          localStorage.setItem("posts", JSON.stringify(response.userId));
          this.post = "";
          console.log("Post criado com sucesso!");
        })
        .catch((error) => {
          console.log("Error ao criar o post: " + error);
        });
    },
    async deletePost(id, nome) {
      console.log(this.user.nome, nome, id);
      if (this.user.nome === nome) {
        await firebase.firestore().collection("posts").doc(id).delete();
      } else {
        return;
      }
    },

    async enjoy(id, likes) {
      const userId = this.user.uid;
      const docId = `${userId}_${id}`;

      //Checando se o post já foi curtido, se ja foi curtido, vou poder tirar essa curtida, se ele não foi curtido, vou poder curtir
      const doc = await firebase
        .firestore()
        .collection("likes")
        .doc(docId)
        .get();

      //vai devolver um true se ja tiver um doc com esse ID e quer dizer que ja foi dado o like com esse docId, se não deu,vai retornar false e  não vai existir o docId
      if (doc.exists) {
        await firebase
          .firestore()
          .collection("posts")
          .doc(id)
          .update({
            likes: likes - 1,
          });

        await firebase.firestore().collection("likes").doc(docId).delete();
        return;
      }

      await firebase.firestore().collection("likes").doc(docId).set({
        postId: id,
        userId: userId,
      });

      //criar o like
      await firebase
        .firestore()
        .collection("posts")
        .doc(id)
        .update({
          likes: likes + 1,
        });
    },
    modalPost(post) {
      this.showModal = !this.showModal;

      if (this.showModal) {
        this.fullPost = post;
      } else {
        this.fullPost = {};
      }
    },
  },

  //------FILTERS-------
  filters: {
    //recebe o valor que desejamos filtrar
    postLength(valor) {
      if (valor.length < 200) {
        return valor;
      }

      return `${valor.substring(0, 200)}...`; //substring vai cortar a string passa como parametro e vai setar em qual caracter ela começa e qual ela termina, neste caso começa na string 0 e vai até o caracter 200...
    },
  },
};
</script>

<style scoped>
#home {
  display: flex;
  flex-direction: row;
  margin: 25px;
}

.loading {
  width: 40px;
  height: 40px;
  border: 5px solid #e5e5e5;
  border-top-color: #ffb800;
  border-radius: 50%;
  margin-top: 25px;
  animation: rotation 1s infinite;
}

@keyframes rotation {
  to {
    transform: rotate(1turn);
  }
}

.d-flex {
  display: flex;
  justify-content: center;
  align-items: top;
}

@import "./home.css";
</style>