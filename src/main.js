//O main é onde começa aplicação quando rodamos a mesma, ele criar e renderiza o primeiro componente, ele monta as rotas, etc..

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import firebase from './services/firebaseConnection'

Vue.config.productionTip = false

let app

//Antes dele montar o componente em tela, ele verifica se tem um usuário logado ou não, ele passa pelo onAuthStateChanged, quando tiver um usuário logado ele ja vai saber e notificar as rotas configuradas e o 'firebase.atuh().currentUser vai receber true e deixar passar para as próximas rotas.
firebase.auth().onAuthStateChanged(() => {
   if(!app){
    app = new Vue({
      router,
      render: h => h(App),
    }).$mount('#app')
  }
})

