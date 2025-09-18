import { supabase } from "./supabaseClient.js";

// Alternar entre login e cadastro
const loginSection = document.getElementById("loginSection");
const registerSection = document.getElementById("registerSection");

document.getElementById("goRegister").addEventListener("click", () => {
  loginSection.classList.add("hidden");
  registerSection.classList.remove("hidden");
});

document.getElementById("goLogin").addEventListener("click", () => {
  registerSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
});

// ---- LOGIN ----
document.getElementById("loginForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const loginError = document.getElementById("loginError");

  const { data: user, error } = await supabase
    .from("usuarios")
    .select("*")
    .eq("username", username)
    .eq("senha", password)
    .single();

  if (user) {
    localStorage.setItem("loggedUser", JSON.stringify(user));
    window.location.href = "index.html"; // redireciona para home
  } else {
    console.error(error);
    loginError.classList.remove("hidden");
  }
});

// ---- CADASTRO ----
document.getElementById("registerForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const username = document.getElementById("regUsername").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const registerError = document.getElementById("registerError");
  const registerSuccess = document.getElementById("registerSuccess");

  // Verifica se já existe
  const { data: exists } = await supabase
    .from("usuarios")
    .select("*")
    .eq("username", username)
    .single();

  if (exists) {
    registerError.classList.remove("hidden");
    registerSuccess.classList.add("hidden");
    return;
  }

  // Insere usuário
  const { error } = await supabase
    .from("usuarios")
    .insert([{ username, senha: password }]);

  if (error) {
    console.error(error);
    registerError.classList.remove("hidden");
    registerSuccess.classList.add("hidden");
  } else {
    registerError.classList.add("hidden");
    registerSuccess.classList.remove("hidden");

    document.getElementById("registerForm").reset();

    // Volta para login após 2s
    setTimeout(() => {
      registerSection.classList.add("hidden");
      loginSection.classList.remove("hidden");
    }, 2000);
  }
});
