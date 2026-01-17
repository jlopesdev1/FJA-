import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB4o1ksDppKidbzgOb2ExXVpWbPmiv_R24",
  authDomain: "fja-a8a36.firebaseapp.com",
  projectId: "fja-a8a36",
  storageBucket: "fja-a8a36.firebasestorage.app",
  messagingSenderId: "460412515908",
  appId: "1:460412515908:web:1b4ed60b185f9326492e11"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const container = document.getElementById("projects-container");
const newBtn = document.getElementById("new-project");

let currentUser = null;

// protege a página
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  } else {
    currentUser = user;
    loadProjects();
  }
});

// carregar projetos do próprio usuário
async function loadProjects() {
  container.innerHTML = "";

  const q = query(
    collection(db, "projects"),
    where("owner", "==", currentUser.uid)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    container.innerHTML = `<p class="placeholder">Nenhum projeto criado ainda.</p>`;
    return;
  }

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();

    const div = document.createElement("div");
    div.classList.add("project");

    div.innerHTML = `
      <h3>${data.title}</h3>

      <select>
        <option ${data.phase === "Ideação" ? "selected" : ""}>Ideação</option>
        <option ${data.phase === "Planejamento" ? "selected" : ""}>Planejamento</option>
        <option ${data.phase === "Em desenvolvimento" ? "selected" : ""}>Em desenvolvimento</option>
        <option ${data.phase === "Ajustes" ? "selected" : ""}>Ajustes</option>
        <option ${data.phase === "Finalizado" ? "selected" : ""}>Finalizado</option>
      </select>

      <textarea rows="4">${data.description || ""}</textarea>

      <button class="save">Salvar atualização</button>
    `;

    const saveBtn = div.querySelector(".save");
    const select = div.querySelector("select");
    const textarea = div.querySelector("textarea");

    saveBtn.addEventListener("click", async () => {
      await updateDoc(doc(db, "projects", docSnap.id), {
        phase: select.value,
        description: textarea.value,
        updatedAt: serverTimestamp()
      });

      alert("Projeto atualizado com sucesso!");
    });

    container.appendChild(div);
  });
}

// criar novo projeto
newBtn.addEventListener("click", async () => {
  if (!currentUser) {
    alert("Usuário não autenticado.");
    return;
  }

  const title = prompt("Nome do projeto:");
  if (!title.trim()) return;

  try {
    await addDoc(collection(db, "projects"), {
      title: title.trim(),
      owner: currentUser.uid,
      phase: "Ideação",
      description: "Projeto em fase inicial.",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    loadProjects(); // recarrega a lista

  } catch (error) {
    console.error("Erro ao criar projeto:", error);
    alert("Erro ao criar projeto. Veja o console.");
  }
});

