// Trocar seções ao clicar nos botões
const navButtons = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".content-section");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");

    // Esconde todas as seções
    sections.forEach(sec => sec.classList.add("hidden"));

    // Mostra a seção escolhida
    document.getElementById(target).classList.remove("hidden");
  });
});

// Botão de sair (logout)
document.getElementById("logoutBtn").addEventListener("click", () => {
  alert("Você saiu do sistema!");
  window.location.href = "login.html"; // volta para login
});

// Simulação de nome do usuário (pode puxar do localStorage futuramente)
document.getElementById("username").textContent = "Nome do Usuário";
