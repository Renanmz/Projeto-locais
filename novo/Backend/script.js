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

// --- Eventos de navegação ---
const navButtons = document.querySelectorAll(".nav-btn");
const sections = document.querySelectorAll(".content-section");

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.getAttribute("data-target");

    sections.forEach(sec => sec.classList.add("hidden"));
    document.getElementById(target).classList.remove("hidden");

    if (target === "locais") renderRestaurants();
    if (target === "favoritos") renderFavorites();
  });
});

// --- Logout ---
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedUser");
  window.location.href = "login.html";
});
