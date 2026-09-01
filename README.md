# Habesha Recipes — Module 2 Project (Day 23 core)

One of the CodeOps alternative briefs: browse Ethiopian recipes loaded from
data, filter them, view full ingredients & instructions, and save favourites
to a personal cookbook that survives a reload. Same skeleton as the Addis
Eats flagship — load data → render a list → filter → select/save → persist
— themed around recipes instead of a cart.

## 1. How to run it

Browsers block `fetch()` on a `file://` page, so serve the folder rather
than double-clicking `index.html`:

**Python (no install needed):**
```bash
cd habesha-recipes
python3 -m http.server 8000
```
Then open `http://localhost:8000`.

**VS Code:** install "Live Server" → right-click `index.html` →
**Open with Live Server**.

**Node, if you have it:**
```bash
npx serve habesha-recipes
```

## 2. File structure

```
habesha-recipes/
├── index.html         semantic scaffold: header, recipes section, cookbook aside, footer, dialog
├── styles.css          responsive layout (mobile-first grid) + component styles
├── app.js              state, fetch, render(), search/filter, save, persistence, recipe dialog
├── data/
│   └── recipes.json    the data model — 11 recipes across 5 categories
└── README.md           this file
```

## 3. Requirements checklist (against the brief)

| Must-have (same list for every project idea) | Status | Where |
|---|---|---|
| Semantic, accessible HTML | ✅ | `header/main/section/aside/footer`, native `<dialog>`, `aria-label`s, skip link, visible focus |
| Responsive CSS layout | ✅ | 1 column on mobile → `2fr 1fr` at 800px; recipe grid uses `auto-fill/minmax` |
| Data loaded & rendered by JS | ✅ | `fetch("data/recipes.json")` → `state.recipes` → `render()` |
| Events + persistent state | ✅ | search/category/spicy filters, save toggle, `localStorage` survives reload |
| Browse recipes | ✅ | data-driven grid, one card per recipe |
| Filter | ✅ | live search by name, category dropdown, "spicy only" checkbox — all combine |
| Save a cookbook | ✅ | ★ Save toggle on each card and inside the detail view, "My Cookbook" panel |
| Persist on reload | ✅ | only recipe **ids** are stored in `localStorage`, looked up against the data on load |
| Nice: view full recipe | ✅ | native `<dialog>` modal with ingredients + numbered instructions, closes on Esc/backdrop/✕ |
| Nice: empty & loading states | ✅ | "Loading recipes…", "No recipes found", "Your cookbook is empty" |

## 4. Git — commit and push

```bash
cd habesha-recipes
git init                      # skip if already a repo
git add .
git commit -m "Habesha Recipes: working core — data, filter, save, cookbook"
git branch -M main
git remote add origin <your-repo-url>   # first time only
git push -u origin main
```

<!-- ## 5. How to present it (Day 25 / group demo)

Keep it to ~3 minutes:

1. **One line on the brief** — "Habesha Recipes: browse Ethiopian dishes,
   filter them, and save favourites to a personal cookbook. Same data →
   render → filter → save → persist pattern as Addis Eats, different theme."
2. **Show the responsive shell** — resize the browser to show one column
   on mobile becoming a two-column recipes + cookbook layout on desktop.
3. **Demo the core loop live**:
   - Type in search (e.g. "wat") → grid filters instantly.
   - Pick a category, then tick "Spicy only" → filters combine.
   - Click **View recipe** on a card → the dialog opens with full
     ingredients and steps; close it with Esc, the ✕, or clicking outside.
   - Click **★ Save** on 2-3 recipes → point out "My Cookbook" filling in
     and the count updating.
   - **Reload the page** → the cookbook is still there — "that's
     `localStorage`, only the ids are stored, the recipe data itself is
     re-fetched fresh every time."
4. **Remove one from the cookbook**, then show **Clear cookbook**.
5. **Close with what's next** — "Tomorrow's polish: more recipes, maybe a
   'fasting-friendly' filter, and visual polish before Day 25 assessment."

### If they ask you the review questions (from the slides)

- **Why plan first?** A feature list, wireframe, and data model turn "an
  app about recipes" into a scoped, buildable spec before any code —
  here that meant deciding up front that a recipe needs ingredients,
  instructions, time, and category, not discovering it mid-build.
- **Which semantic elements, and why?** `header`, `main`, `section`,
  `aside`, `footer`, and a native `<dialog>` for the recipe detail —
  `<dialog>` gets focus-trapping and Escape-to-close for free, instead of
  hand-rolling a modal.
- **How is it responsive?** Mobile-first: one column by default, a
  `min-width: 800px` media query splits recipes and cookbook into
  `2fr 1fr`; the recipe grid itself uses
  `repeat(auto-fill, minmax(200px, 1fr))` so cards reflow at any width.
- **Why one state object?** `recipes`, `savedIds`, `search`, `category`,
  and `spicyOnly` are the single source of truth — `render()` just reads
  that object, so search, category, and spicy filters all combine
  correctly without extra bookkeeping.
- **How does live search work end to end?** The `input` event on
  `#search` writes into `state.search`, then `render()` filters
  `state.recipes` by name (and the other active filters) and redraws
  the grid — same shape as Addis Eats' search.
- **How does saving use delegation, and why store only ids?** One `click`
  listener on `#recipes` and one on `#cookbook-list` check `e.target` to
  tell View from Save/Remove apart. Only the recipe **id** is persisted
  to `localStorage` — the full recipe (ingredients, steps) always comes
  from `data/recipes.json`, so the saved list can't drift out of sync
  with the data.

## 6. Honest gaps / good next steps (Day 24 polish)

- Recipe art is emoji, not photos — swap in real images if you have time.
- No serving-size scaling on ingredient amounts (Addis Eats' cart has a
  live total because money adds up; recipes don't need that kind of math,
  but scaling ingredients by servings would be a nice Day 24 stretch goal).
- No automated tests — add if your course wants them. -->
