import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

let firebaseConfig = {
  apiKey: "AIzaSyA_mDDZ7H9icmML6MrHHMW1HQodOAwCuRA",
  authDomain: "blogapp-2ce5c.firebaseapp.com",
  projectId: "blogapp-2ce5c",
  storageBucket: "blogapp-2ce5c.appspot.com",
  messagingSenderId: "162610372457",
  appId: "1:162610372457:web:3608ff206994d3829de7f8",
  measurementId: "G-B3DHZ4TJ1Q"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
}

export default firebase;
