import { supabase } from "./supabaseClient.js";

// --- Verifica se há usuário logado ---
const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
if (!loggedUser) {
  window.location.href = "login.html";
} else {
  document.getElementById("username").textContent = loggedUser.username;
}

// --- Função para renderizar restaurantes ---
async function renderRestaurants() {
  const { data: restaurantes, error } = await supabase
    .from("restaurantes")
    .select("*");

  if (error) {
    console.error(error);
    return;
  }

  const { data: favs } = await supabase
    .from("favoritos")
    .select("restaurante_id")
    .eq("usuario_id", loggedUser.id);

  const favIds = favs ? favs.map(f => f.restaurante_id) : [];
  const locaisDiv = document.getElementById("locais");

  locaisDiv.innerHTML = `<h2 class="text-xl font-semibold mb-2">Locais</h2>`;

  restaurantes.forEach(r => {
    const isFav = favIds.includes(r.id);

    const card = document.createElement("div");
    card.className = "border rounded-lg p-4 shadow-md bg-white mb-4";

    card.innerHTML = `
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-lg font-bold">${r.nome}</h3>
          <span class="text-sm text-gray-600">${r.categoria}</span>
        </div>
        <button class="fav-btn px-3 py-1 text-xs rounded ${
          isFav ? "bg-yellow-400" : "bg-gray-300"
        }" data-id="${r.id}">
          ${isFav ? "★ Favorito" : "☆ Favoritar"}
        </button>
      </div>
      <p class="text-sm text-gray-700 mt-1">📍 ${r.endereco}</p>
      <p class="text-sm text-gray-700">📞 ${r.telefone}</p>
      <p class="text-sm mt-1">🍽 Prato Popular: ${r.prato}</p>
      <p class="text-sm">⭐ Avaliação: ${r.avaliacao}</p>
    `;

    locaisDiv.appendChild(card);
  });

  // Botões de favorito
  document.querySelectorAll(".fav-btn").forEach(btn => {
    btn.addEventListener("click", async () => {
      await toggleFavorite(btn.getAttribute("data-id"));
      renderRestaurants(); // Atualiza lista
    });
  });
}

// --- Função para favoritar/desfavoritar ---
async function toggleFavorite(restauranteId) {
  const { data: exists } = await supabase
    .from("favoritos")
    .select("*")
    .eq("usuario_id", loggedUser.id)
    .eq("restaurante_id", restauranteId)
    .single();

  if (exists) {
    await supabase.from("favoritos").delete().eq("id", exists.id);
  } else {
    await supabase
      .from("favoritos")
      .insert([{ usuario_id: loggedUser.id, restaurante_id: restauranteId }]);
  }
}

// --- Função para renderizar favoritos ---
async function renderFavorites() {
  const { data: favs, error } = await supabase
    .from("favoritos")
    .select("restaurantes(*)")
    .eq("usuario_id", loggedUser.id);

  const favDiv = document.getElementById("favoritos");
  favDiv.innerHTML = `<h2 class="text-xl font-semibold mb-2">Favoritos</h2>`;

  if (error || !favs || favs.length === 0) {
    favDiv.innerHTML += `<p class="text-sm text-gray-600">Nenhum restaurante favoritado.</p>`;
    return;
  }

  favs.forEach(f => {
    const r = f.restaurantes;
    const card = document.createElement("div");
    card.className = "border rounded-lg p-4 shadow-md bg-white mb-4";

    card.innerHTML = `
      <h3 class="text-lg font-bold">${r.nome}</h3>
      <span class="text-sm text-gray-600">${r.categoria}</span>
      <p class="text-sm text-gray-700 mt-1">📍 ${r.endereco}</p>
      <p class="text-sm text-gray-700">📞 ${r.telefone}</p>
      <p class="text-sm mt-1">🍽 Prato Popular: ${r.prato}</p>
      <p class="text-sm">⭐ Avaliação: ${r.avaliacao}</p>
    `;

    favDiv.appendChild(card);
  });
}

// --- Função para renderizar perfil ---
function renderProfile() {
  const perfilDiv = document.getElementById("perfil");

  perfilDiv.innerHTML = `
    <h2 class="text-xl font-semibold mb-4">Perfil</h2>

    <div class="border rounded-lg p-4 shadow-md bg-gray-50">
      <div class="flex items-center gap-4">
        <!-- Avatar -->
        <div class="w-16 h-16 bg-sky-400 text-white flex items-center justify-center rounded-full text-2xl font-bold">
          JP
        </div>
        <!-- Nome e email -->
        <div>
          <h3 class="text-lg font-bold">João Pedro da Silva</h3>
          <p class="text-sm text-gray-600">joaopedro@email.com</p>
        </div>
      </div>

      <div class="mt-4 text-sm text-gray-700 space-y-2">
        <p>📍 Localização: São Paulo - SP</p>
        <p>🎂 Idade: 28 anos</p>
        <p>📞 Telefone: (11) 98765-4321</p>
        <p>⭐ Membro desde: 2021</p>
      </div>

      <div class="mt-4">
        <button class="px-4 py-2 bg-sky-500 text-white rounded-md text-sm hover:bg-sky-600">
          Editar Perfil
        </button>
      </div>
    </div>
  `;
}
// --- Função para renderizar início ---
function renderInicio() {
  const inicioDiv = document.getElementById("inicio");

  inicioDiv.innerHTML = `
    <h2 class="text-xl font-semibold mb-4">Bem-vindo ao AchaRestaurantes!</h2>

    <div class="grid grid-cols-2 gap-4 mb-6">
      <div class="bg-sky-100 rounded-xl p-4 shadow">
        <p class="text-sm text-gray-600">🍽 Restaurantes cadastrados</p>
        <h3 class="text-2xl font-bold text-sky-700">124</h3>
      </div>
      <div class="bg-green-100 rounded-xl p-4 shadow">
        <p class="text-sm text-gray-600">⭐ Avaliações feitas</p>
        <h3 class="text-2xl font-bold text-green-700">879</h3>
      </div>
      <div class="bg-yellow-100 rounded-xl p-4 shadow">
        <p class="text-sm text-gray-600">👤 Usuários ativos</p>
        <h3 class="text-2xl font-bold text-yellow-700">312</h3>
      </div>
      <div class="bg-purple-100 rounded-xl p-4 shadow">
        <p class="text-sm text-gray-600">🏆 Restaurante mais popular</p>
        <h3 class="text-lg font-semibold text-purple-700">Pizzaria Bella Itália</h3>
      </div>
    </div>

    <div class="bg-white border rounded-xl p-4 shadow-md">
      <h3 class="text-lg font-semibold mb-2">Novidades</h3>
      <ul class="text-sm text-gray-700 list-disc list-inside space-y-1">
        <li>Novo restaurante cadastrado: <strong>Churrascaria Boi na Brasa</strong></li>
        <li>Avaliações agora contam com fotos 📷</li>
        <li>Promoção do mês: <strong>10% OFF em frutos do mar</strong></li>
      </ul>
    </div>
  `;
}


// --- Eventos de navegação ---
const navButtons = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".content-section");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");

    sections.forEach(sec => sec.classList.add("hidden"));
    document.getElementById(target).classList.remove("hidden");

    if (target === "inicio") renderInicio();
    if (target === "locais") renderRestaurants();
    if (target === "favoritos") renderFavorites();
    if (target === "perfil") renderProfile();
  });
});

// --- Logout ---
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedUser");
  window.location.href = "login.html";
});
