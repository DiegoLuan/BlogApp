<template>
  <div id="perfil">
    <div v-if="loading" class="postarea d-flex">
      <div class="loading"></div>
    </div>

    <div v-else>
      <div class="headerPerfil">
        <h2>Olá {{ nome }}</h2>
        <span
          >Ja fez <strong>{{ posts.length }}</strong>
          {{ posts.length === 1 ? "post" : "posts" }}
        </span>
      </div>

      <div class="postarea">
        <article v-for="(post, index) in posts" :key="index" class="post">
          <h1>{{ post.nome }}</h1>
          <p>{{ post.content }}</p>

          <div class="action-post">
            <button @click="modalPost(post)">Veja post Completo</button>
          </div>
        </article>
      </div>
    </div>

    <Modal v-if="showModal" :post="fullPost" @close="modalPost()" />
  </div>
</template>

<script>
import Modal from "../components/Modal";
import firebase from "../services/firebaseConnection";
export default {
  name: "Perfil",
  components: {
    Modal,
  },
  data() {
    return {
      loading: true,
      showModal: false,
      fullPost: {},
      posts: [],
      nome: "",
      user: {},
    };
  },
  props: ["userid"],
  async created() {
    const userStorage = localStorage.getItem("devPost");

    this.user = JSON.parse(userStorage);

    //buscar no firebase onde ('where') o userId do post é igual ('==') ao userid que é passado nas props
    await firebase
      .firestore()
      .collection("posts")
      .where("userId", "==", this.userid)
      .orderBy("created", "desc")
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
        this.nome = this.posts[0].nome;
        this.loading = false;
      });
  },
  methods: {
    modalPost(post) {
      this.showModal = !this.showModal;

      if (this.showModal) {
        this.fullPost = post;
      } else {
        this.fullPost = {};
      }
    },
  },
};
</script>

<style scoped>
.d-flex {
  display: flex;
  justify-content: center;
  align-items: top;
}

.loading {
  width: 40px;
  height: 40px;
  border: 5px solid #e5e5e5;
  border-top-color: #ffb800;
  border-radius: 50%;
  animation: rotation 1s infinite;
}

@keyframes rotation {
  to {
    transform: rotate(1turn);
  }
}
</style>