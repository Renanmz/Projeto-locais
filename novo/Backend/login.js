document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMsg = document.getElementById("errorMsg");

  // Usuário e senha fixos (mock). Substitua depois por autenticação real.
  const user = {
    username: "admin",
    password: "123456"
  };

  if (username === user.username && password === user.password) {
    alert("Login realizado com sucesso!");
    window.location.href = "home.html"; // redireciona para outra página
  } else {
    errorMsg.classList.remove("hidden");
  }
});
