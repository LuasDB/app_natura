import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.9.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCbok1jgu6NgEOFvDDCJ4HMYTO6xsv-klo",
    authDomain: "app-natura-af009.firebaseapp.com",
    databaseURL: "https://app-natura-af009-default-rtdb.firebaseio.com",
    projectId: "app-natura-af009",
    storageBucket: "app-natura-af009.appspot.com",
    messagingSenderId: "189919654229",
    appId: "1:189919654229:web:ee7c983ee05c121d243fdc"
  };

  // Inicializacion  Firebase y base de datos de Firestore
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const email = "brenda6s@correo.com";
const password = "quesadilla16";

//***********Autenticar usuario**************************************************************************************************************************** */
// signInWithEmailAndPassword(auth, email, password)
//   .then((userCredential) => {
//     // Signed in
//     const user = userCredential.user;
//     console.log('Autenticado:' + user.uid);
//     idUser = user.uid;
//     window.location.href = "index.html";
//   })
//   .catch((error) => {
//     const errorCode = error.code;
//     const errorMessage = error.message;
//     window.location.href = "login.html";
//   });






