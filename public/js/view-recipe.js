const recipeImagesContaier = document.getElementById("recipe-images-container");
const commentForm = document.getElementById("comment-form");
const ratingStars = document.getElementById("rating-stars");
const commentInput = document.getElementById("comment");

let rating = 0;

async function fetchRecipe(id) {
  const response = await fetch("/api/v1/recipes/" + id);
  const json = await response.json();
  const recipe = json.data;
  return recipe;
}

async function loadRecipeImages() {
  const id = getPathname();
  const recipe = await fetchRecipe(id);

  if (recipe.images.length === 0) {
    return;
  }

  const recipeImagesComponent = createCarrousselComponent(
    recipe.images.map(({ url }) => url),
    recipe.name
  );
  recipeImagesContaier.innerHTML = "";
  recipeImagesContaier.appendChild(recipeImagesComponent);
}

async function reviewRecipe() {
  const comment = commentInput.value;

  if (!comment.trim()) return;

  const id = getPathname();

  const response = await fetch("/api/v1/recipes/review", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipeId: id,
      rating,
      text: comment,
    }),
  });

  if (response.status !== 201) {
    return showToast("Erro ao avaliar receita! Tente novamente");
  }

  window.location.reload();
}

document.addEventListener("DOMContentLoaded", function () {
  loadRecipeImages();

  commentForm?.addEventListener("submit", (e) => {
    e.preventDefault();
    reviewRecipe();
  });

  ratingStars?.addEventListener("change", (event) => {
    const selectedRating = event.target.value;
    rating = Number(selectedRating);
  });

  const recipeId = getPathname();
  showPageMessage(recipeId);
});
