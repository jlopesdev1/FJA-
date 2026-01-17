// ===============================
// FIREBASE APP
// ===============================
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";

// ===============================
// AUTH
// ===============================
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ===============================
// FIRESTORE
// ===============================
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ===============================
// CONFIG
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyB4o1ksDppKidbzgOb2ExXVpWbPmiv_R24",
  authDomain: "fja-a8a36.firebaseapp.com",
  projectId: "fja-a8a36",
  storageBucket: "fja-a8a36.firebasestorage.app",
  messagingSenderId: "460412515908",
  appId: "1:460412515908:web:1b4ed60b185f9326492e11"
};

// ===============================
// INIT
// ===============================
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ===============================
// PROTEÇÃO DA PÁGINA
// ===============================
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    loadProjects(); // só carrega projetos se estiver logado
  }
});

// ===============================
// LOGOUT
// ===============================
const logoutBtn = document.getElementById("logout-btn");

logoutBtn.addEventListener("click", () => {
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
});

// ===============================
// CARREGAR PROJETOS NO DASHBOARD
// ===============================
const projectsList = document.getElementById("projects-list");

async function loadProjects() {
  projectsList.innerHTML = "";

  try {
    const q = query(
      collection(db, "projects"),
      orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      projectsList.innerHTML = `
        <p class="placeholder">
          Nenhum projeto publicado ainda.
          Os projetos aparecerão automaticamente conforme forem cadastrados.
        </p>
      `;
      return;
    }

    snapshot.forEach((doc) => {
      const project = doc.data();

      const card = document.createElement("div");
      card.classList.add("project-card");

      card.innerHTML = `
  <div class="project-header">
    <h3>${project.title}</h3>
    <span class="phase">${project.phase ?? "Fase não definida"}</span>
  </div>

  <p class="project-desc">
    ${project.description || "Projeto em fase inicial."}
  </p>
`;


      projectsList.appendChild(card);
    });

  } catch (error) {
    console.error("Erro ao carregar projetos:", error);
    projectsList.innerHTML = `<p>Erro ao carregar projetos.</p>`;
  }
}
