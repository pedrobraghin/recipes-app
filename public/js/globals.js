const categoriesContainer = document.getElementById("categories-container");
const scrollLeftCategoryButton = document.getElementById(
  "scroll-left-category-button"
);
const scrollRightCategoryButton = document.getElementById(
  "scroll-right-category-button"
);
const searchResultsContainer = document.getElementById(
  "search-results-container"
);

const searchInput = document.getElementById("search-input");

categoriesContainer.addEventListener("wheel", (e) => {
  const delta = e.deltaY || e.detail || e.wheelDelta;

  if (delta > 0) {
    categoriesContainer.scrollLeft += 100;
  } else {
    categoriesContainer.scrollLeft -= 100;
  }

  e.preventDefault();
});

scrollLeftCategoryButton.addEventListener("click", () => {
  categoriesContainer.scrollLeft -= 100;
});

scrollRightCategoryButton.addEventListener("click", () => {
  categoriesContainer.scrollLeft += 100;
});

async function post(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body,
  });

  const json = await response.json();
  return json;
}

function redirect(to) {
  window.location.replace(to);
}

function getQueryParams() {
  return new URLSearchParams(window.location.search);
}

function getPathname() {
  return window.location.pathname.split("/").reverse()[0];
}

function groupRecipesByCategory(recipes) {
  const result = recipes.reduce((x, y) => {
    (x[y.categories[0].name] = x[y.categories[0].name] || []).push(y);

    return x;
  }, {});

  return result;
}

function capitalize(str) {
  if (!str) {
    return "";
  }

  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

async function loadCategories() {
  const categories = await fetchCategories();
  categories.forEach((category) =>
    appendCategory(createCategoryComponent(category))
  );
}

async function fetchCategories() {
  const response = await fetch("/api/v1/categories");
  const json = await response.json();
  return json.data;
}

function appendCategory(category) {
  categoriesContainer.appendChild(category);
}

function showToast(text) {
  const toast = document.getElementById("toast");

  toast.innerHTML = `<span>${text}</span>`;

  toast.style.right = "2%";

  setTimeout(() => {
    toast.style.right = "-100%";
  }, 3000);
}

function setGlobalMessage(page, message) {
  localStorage.setItem(page, message);
}

function getGlobalMessage(page) {
  const message = localStorage.getItem(page);

  if (message) {
    localStorage.removeItem(page);
  }

  return message;
}

function showPageMessage(page) {
  const message = getGlobalMessage(page);

  if (!message) {
    return;
  }

  showToast(message);
}

async function searchRecipesByTerm(term) {
  const response = await fetch("/api/v1/recipes/terms/" + term);

  if (response.status !== 200) {
    showToast("Erro ao pesquisar, tente novamente!");
    return [];
  }

  const json = await response.json();
  return json.data;
}

async function handleSearchTerm(term) {
  const recipes = await searchRecipesByTerm(term);
  searchResultsContainer.innerHTML = "";

  if (recipes.length === 0) {
    searchResultsContainer.innerHTML =
      "<li><span>Nenhum resultado encontrado.</span></li>";
    return;
  }

  recipes.forEach((recipe) => {
    const searchItemComponent = createSearchResultComponent(recipe);
    searchResultsContainer.appendChild(searchItemComponent);
  });

  searchResultsContainer.classList.remove("hide");
}

loadCategories();

searchInput.addEventListener("input", (e) => {
  const term = e.target.value;

  if (!term.trim()) {
    searchResultsContainer.classList.add("hide");
    searchResultsContainer.innerHTML = "";
    return;
  }

  handleSearchTerm(term);
});
