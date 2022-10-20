import Vue from 'vue'
import Router from 'vue-router'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Perfil from './pages/Perfil'

import firebase from './services/firebaseConnection'

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/', 
      component: Home,
      meta:{
        requiresAuth: true
      }
    }, 
    {
      path: '/dashboard', 
      component: Dashboard,
      meta:{
        requiresAuth: true
      }
    }, 
    {
      path: '/login', 
      component: Login
    }, 
    {
      path: '/perfil/:userid', 
      component: Perfil,
      props: true,
      meta:{
        requiresAuth: true
      }
    }, 
  ]
})

router.beforeEach((to, from, next) => {
  //some vai verificar todas as rotas que queremos entrar e se alguma retorna o requiresAuth: true (do meta em cada rota), a variavel requiresAuth abaixo receberá true
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  //se o usuário estiver logado o currentUser vai retornar alguma coisa, senão, vai retornar nada!
  if(requiresAuth && !firebase.auth().currentUser){
    next('/login');
  }else{
    next();
  }
})

export default router;