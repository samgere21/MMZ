/* ==========================================================
   Habesha Recipes — app.js
   One state object -> render() -> the whole UI follows.
   Skeleton: load data -> render list -> filter -> select/save -> persist.
   ========================================================== */

const state = {
  recipes: [],   // loaded from data/recipes.json
  savedIds: [],  // ids saved to "My Cookbook"
  search: "",    // current search text
  category: "",  // current category filter
  spicyOnly: false,
};

// ---------- DOM references ----------
const recipesEl = document.querySelector("#recipes");
const categoryEl = document.querySelector("#category");
const spicyOnlyEl = document.querySelector("#spicy-only");
const searchEl = document.querySelector("#search");

const cookbookListEl = document.querySelector("#cookbook-list");
const cookbookCountEl = document.querySelector("#cookbook-count");
const clearCookbookBtn = document.querySelector("#clear-cookbook");

const dialogEl = document.querySelector("#recipe-dialog");
const dialogContentEl = document.querySelector("#dialog-content");
const dialogCloseBtn = document.querySelector("#dialog-close");

// ---------- Load data into state ----------
async function loadRecipes() {
  recipesEl.innerHTML = `<p class="status">Loading recipes…</p>`;
  try {
    const res = await fetch("data/recipes.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    state.recipes = await res.json();

    // safety: drop any saved id that no longer exists in the data
    const validIds = new Set(state.recipes.map(r => r.id));
    state.savedIds = state.savedIds.filter(id => validIds.has(id));

    populateCategories();
    render();
  } catch (err) {
    recipesEl.innerHTML = `<p class="status error">Could not load the recipes. Please refresh the page.</p>`;
    console.error(err);
  }
}

function populateCategories() {
  const cats = [...new Set(state.recipes.map(r => r.category))];
  categoryEl.innerHTML =
    `<option value="">All categories</option>` +
    cats.map(c => `<option value="${c}">${c}</option>`).join("");
}

// ---------- Render everything from state ----------
function render() {
  const term = state.search.trim().toLowerCase();

  const shown = state.recipes.filter(r => {
    const matchesTerm = r.name.toLowerCase().includes(term);
    const matchesCategory = !state.category || r.category === state.category;
    const matchesSpicy = !state.spicyOnly || r.spicy;
    return matchesTerm && matchesCategory && matchesSpicy;
  });

  if (shown.length === 0) {
    recipesEl.innerHTML = `<p class="status">No recipes found. Try a different search or filter.</p>`;
  } else {
    recipesEl.innerHTML = shown.map(r => {
      const saved = state.savedIds.includes(r.id);
      return `
      <article class="recipe" data-id="${r.id}">
        <div class="recipe-emoji" aria-hidden="true">${r.emoji || "🍲"}</div>
        <h3>${r.name}</h3>
        <p class="recipe-meta">${r.category} · ${r.time}${r.spicy ? " · 🌶️" : ""}</p>
        <div class="recipe-actions">
          <button class="view-btn" type="button" aria-label="View ${r.name} recipe">View recipe</button>
          <button class="save-btn" type="button" aria-pressed="${saved}" aria-label="${saved ? "Remove " + r.name + " from cookbook" : "Save " + r.name + " to cookbook"}">
            ${saved ? "★ Saved" : "☆ Save"}
          </button>
        </div>
      </article>`;
    }).join("");
  }

  renderCookbook();
}

function renderCookbook() {
  const saved = state.savedIds
    .map(id => state.recipes.find(r => r.id === id))
    .filter(Boolean);

  if (saved.length === 0) {
    cookbookListEl.innerHTML = `<li class="status">Your cookbook is empty. Save a few recipes to get started.</li>`;
  } else {
    cookbookListEl.innerHTML = saved.map(r => `
      <li data-id="${r.id}">
        <span class="cookbook-item-name">
          ${r.name}
          <span class="cookbook-item-time">${r.time}</span>
        </span>
        <button class="mini-view" type="button" aria-label="View ${r.name} recipe">View</button>
        <button class="rm" type="button" aria-label="Remove ${r.name} from cookbook">✕</button>
      </li>
    `).join("");
  }

  cookbookCountEl.textContent = `${saved.length} saved`;
  clearCookbookBtn.disabled = saved.length === 0;
}

// ---------- Persistence ----------
function save() {
  localStorage.setItem("habesharecipes-saved", JSON.stringify(state.savedIds));
}

function load() {
  const saved = localStorage.getItem("habesharecipes-saved");
  if (!saved) return;
  try {
    state.savedIds = JSON.parse(saved);
  } catch (err) {
    state.savedIds = [];
  }
}

// ---------- Events: search + filters ----------
searchEl.addEventListener("input", e => {
  state.search = e.target.value;
  render();
});

categoryEl.addEventListener("change", e => {
  state.category = e.target.value;
  render();
});

spicyOnlyEl.addEventListener("change", e => {
  state.spicyOnly = e.target.checked;
  render();
});

// ---------- Events: view + save (delegated on #recipes) ----------
recipesEl.addEventListener("click", e => {
  const card = e.target.closest(".recipe");
  if (!card) return;
  const id = Number(card.dataset.id);

  if (e.target.matches(".view-btn")) {
    openRecipe(id);
  } else if (e.target.matches(".save-btn")) {
    toggleSaved(id);
  }
});

function toggleSaved(id) {
  if (state.savedIds.includes(id)) {
    state.savedIds = state.savedIds.filter(sid => sid !== id);
  } else {
    state.savedIds.push(id);
  }
  save();
  render();
}

// ---------- Events: cookbook list (delegated) ----------
cookbookListEl.addEventListener("click", e => {
  const li = e.target.closest("li[data-id]");
  if (!li) return;
  const id = Number(li.dataset.id);

  if (e.target.matches(".rm")) {
    state.savedIds = state.savedIds.filter(sid => sid !== id);
    save();
    render();
  } else if (e.target.matches(".mini-view")) {
    openRecipe(id);
  }
});

clearCookbookBtn.addEventListener("click", () => {
  state.savedIds = [];
  save();
  render();
});

// ---------- Recipe detail dialog ----------
function openRecipe(id) {
  const r = state.recipes.find(recipe => recipe.id === id);
  if (!r) return;

  const saved = state.savedIds.includes(id);

  dialogContentEl.innerHTML = `
    <h2 id="dialog-title">${r.emoji || "🍲"} ${r.name}</h2>
    <p class="recipe-meta">${r.category} · ${r.time} · Serves ${r.servings}${r.spicy ? " · 🌶️ Spicy" : ""}</p>

    <h3>Ingredients</h3>
    <ul>${r.ingredients.map(i => `<li>${i}</li>`).join("")}</ul>

    <h3>Instructions</h3>
    <ol>${r.instructions.map(step => `<li>${step}</li>`).join("")}</ol>

    <div class="recipe-actions" style="margin-top:1.2rem;">
      <button class="save-btn" type="button" id="dialog-save-btn" aria-pressed="${saved}">
        ${saved ? "★ Saved to cookbook" : "☆ Save to cookbook"}
      </button>
    </div>
  `;

  document.querySelector("#dialog-save-btn").addEventListener("click", () => {
    toggleSaved(id);
    openRecipe(id); // refresh the button label in place
  });

  dialogEl.showModal();
}

dialogCloseBtn.addEventListener("click", () => dialogEl.close());

// close when clicking the backdrop (outside the inner content)
dialogEl.addEventListener("click", e => {
  if (e.target === dialogEl) dialogEl.close();
});

// ---------- Boot ----------
async function init() {
  load();            // restore saved cookbook ids
  await loadRecipes(); // fetch recipes + render
}

init();
