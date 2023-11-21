function createStateSelectOption(state, stateId) {
  return `
    <option value="${stateId}" data-state="${state}" >${state}</option>
  `;
}

function createCitySelectOption(city) {
  return `
    <option value="${city}"" >${city}</option>
  `;
}

function createIngredientNameComponent() {
  const ingredientNameInput = document.createElement("input");
  const ingredientNameLabel = document.createElement("label");
  const ingredientNameFormRow = document.createElement("div");

  ingredientNameInput.required = true;
  ingredientNameInput.setAttribute("placeholder", "ex.: Farinha de trigo");

  ingredientNameLabel.textContent = "Nome";
  ingredientNameFormRow.setAttribute("class", "form-row");
  ingredientNameFormRow.appendChild(ingredientNameLabel);
  ingredientNameFormRow.appendChild(ingredientNameInput);

  return ingredientNameFormRow;
}

function createIngredientQuantityUnityComponent() {
  const ingredientQuantityUnityInput = document.createElement("input");
  const ingredientQuantityUnityLabel = document.createElement("label");
  const ingredientQuantityUnityFormRow = document.createElement("div");

  ingredientQuantityUnityInput.required = true;
  ingredientQuantityUnityInput.setAttribute("placeholder", "ex.: gramas");

  ingredientQuantityUnityLabel.textContent = "Unidade";
  ingredientQuantityUnityFormRow.setAttribute("class", "form-row");
  ingredientQuantityUnityFormRow.setAttribute("required", true);
  ingredientQuantityUnityFormRow.appendChild(ingredientQuantityUnityLabel);
  ingredientQuantityUnityFormRow.appendChild(ingredientQuantityUnityInput);

  return ingredientQuantityUnityFormRow;
}

function createIngredientQuantityComponent() {
  const ingredientQuantityInput = document.createElement("input");
  const ingredientQuantityLabel = document.createElement("label");
  const ingredientQuantityFormrow = document.createElement("div");

  ingredientQuantityInput.required = true;
  ingredientQuantityInput.type = "number";
  ingredientQuantityInput.setAttribute("min", 0);
  ingredientQuantityInput.setAttribute("placeholder", "ex.: 200");

  ingredientQuantityLabel.textContent = "Quantidade";
  ingredientQuantityFormrow.setAttribute("class", "form-row");
  ingredientQuantityFormrow.setAttribute("required", true);
  ingredientQuantityFormrow.appendChild(ingredientQuantityLabel);
  ingredientQuantityFormrow.appendChild(ingredientQuantityInput);

  return ingredientQuantityFormrow;
}

function createRecipeCard(recipe) {
  const recipeContainer = document.createElement("div");
  recipeContainer.setAttribute("class", "recipe-card");

  const recipeName = document.createElement("a");
  recipeName.setAttribute("class", "recipe-name");
  recipeName.textContent = recipe.name;
  recipeName.href = "/receitas/" + recipe.id;

  const recipeDescription = document.createElement("p");
  recipeDescription.textContent = recipe.description;

  const recipeImage = document.createElement("img");
  recipeImage.src = recipe.images[0].url;
  recipeImage.setAttribute("class", "recipe-image-preview");

  const recipeInfosContainer = document.createElement("div");
  recipeInfosContainer.appendChild(recipeName);
  recipeInfosContainer.appendChild(recipeDescription);

  recipeContainer.appendChild(recipeInfosContainer);
  recipeContainer.appendChild(recipeImage);

  return recipeContainer;
}

function createCategoryComponent(category) {
  const categoryListItem = document.createElement("li");
  categoryListItem.setAttribute("class", "category");

  const categoryLink = document.createElement("a");
  categoryLink.textContent = capitalize(category.name);
  categoryLink.href = "/categorias/" + category.id;

  categoryListItem.appendChild(categoryLink);

  return categoryListItem;
}

function createCategoryListItemComponent(categoryName, onClick) {
  const container = document.createElement("li");
  container.setAttribute("class", "category-result-item");

  const categoryNameSpan = document.createElement("span");
  categoryNameSpan.innerText = categoryName;

  container.appendChild(categoryNameSpan);

  container.onclick = onClick;

  return container;
}

function createSelectedCategoryComponent(category, onClick) {
  const container = document.createElement("div");
  container.setAttribute("class", "selected-category");

  const categoryNameSpan = document.createElement("span");
  categoryNameSpan.innerText = category.name;

  container.appendChild(categoryNameSpan);
  container.onclick = () => onClick(category);

  return container;
}

function createCarrousselComponent(images, recipeName) {
  const container = document.createElement("div");
  container.setAttribute("class", "carousel");

  let imgIndex = 0;

  const imageElement = document.createElement("img");
  imageElement.src = images[0] || "#";

  imageElement.alt = "Imagem da receita " + recipeName;

  const imageIndexLabel = document.createElement("span");
  imageIndexLabel.textContent = `${imgIndex + 1}/${images.length}`;

  const previousImgButton = document.createElement("button");
  previousImgButton.textContent = "Anterior";
  previousImgButton.setAttribute("class", "previous-img-button");
  previousImgButton.onclick = () => {
    imgIndex = imgIndex - 1;
    imgIndex = imgIndex < 0 ? images.length - 1 : imgIndex;
    imageIndexLabel.textContent = `${imgIndex + 1}/${images.length}`;

    imageElement.src = images[imgIndex];
  };

  const nextImageButton = document.createElement("button");
  nextImageButton.textContent = "Próxima";
  nextImageButton.setAttribute("class", "previous-img-button");
  nextImageButton.onclick = () => {
    imgIndex = (imgIndex + 1) % images.length;
    imageIndexLabel.textContent = `${imgIndex + 1}/${images.length}`;

    imageElement.src = images[imgIndex];
  };

  const imageContainer = document.createElement("div");
  imageContainer.setAttribute("class", "image-container");
  imageContainer.appendChild(imageElement);

  const buttonsContainer = document.createElement("div");

  buttonsContainer.setAttribute("class", "buttons-container");
  buttonsContainer.appendChild(previousImgButton);
  buttonsContainer.appendChild(imageIndexLabel);
  buttonsContainer.appendChild(nextImageButton);

  container.appendChild(imageContainer);
  container.appendChild(buttonsContainer);

  return container;
}

function createSearchResultComponent(recipe) {
  const container = document.createElement("li");
  const link = document.createElement("a");

  link.setAttribute("class", "search-result-item");
  link.href = "/receitas/" + recipe.id;

  const recipeNameElement = document.createElement("span");
  recipeNameElement.textContent = recipe.name;
  recipeNameElement.setAttribute("class", "search-result-recipe-name");

  const authorNameElement = document.createElement("span");
  authorNameElement.textContent = "Autor: " + recipe.author.name;
  authorNameElement.setAttribute("class", "search-result-author-name");

  link.appendChild(recipeNameElement);
  link.appendChild(authorNameElement);

  container.appendChild(link);

  return container;
}
