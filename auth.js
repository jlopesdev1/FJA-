import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// CONFIG FIREBASE (OBRIGATÓRIO)
const firebaseConfig = {
    apiKey: "AIzaSyB4o1ksDppKidbzgOb2ExXVpWbPmiv_R24",
    authDomain: "fja-a8a36.firebaseapp.com",
    projectId: "fja-a8a36",
    storageBucket: "fja-a8a36.firebasestorage.app",
    messagingSenderId: "460412515908",
    appId: "1:460412515908:web:1b4ed60b185f9326492e11"
  };
// INIT
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ELEMENTOS
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const registerBtn = document.getElementById("register-btn");

// CADASTRO
registerBtn.addEventListener("click", () => {
  createUserWithEmailAndPassword(
    auth,
    emailInput.value,
    passwordInput.value
  )
    .then(() => {
      alert("Conta criada");
    })
    .catch((error) => {
      alert(error.message);
    });
});

// LOGIN
loginBtn.addEventListener("click", () => {
  signInWithEmailAndPassword(
    auth,
    emailInput.value,
    passwordInput.value
  )
    .then(() => {
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      alert(error.message);
    });
});
