const imageInput = document.getElementById("select-img-input");
const recipeImagesContainer = document.getElementById(
  "recipe-images-container"
);
const addIngredientButton = document.getElementById("add-ingredient-btn");
const ingredientsContainer = document.getElementById("ingredients-container");
const newRecipeForm = document.getElementById("form-new-recipe");

const recipeNameInput = document.getElementById("name");
const prepareTimeInput = document.getElementById("prepare-time");
const recipeDescriptionInput = document.getElementById("description");
const preparationInstructionsInput = document.getElementById(
  "preparation-instructions"
);
const recipeServingsInput = document.getElementById("servings");
const nutritionalValueInput = document.getElementById("nutritional-value");
const cookingMethodInput = document.getElementById("cooking-method");
const categoryInput = document.getElementById("category-input");
const categoriesResultsContainer = document.getElementById(
  "categories-results-container"
);

const selectedCategoriesContainer = document.getElementById(
  "selected-categories-container"
);

const recipeImages = [];
const ingredients = [];
let categories = [];
let selectedCategories = [];

class Ingredient {
  constructor(name = "", quantity = 0, quantityUnity = "") {
    this.name = name;
    this.quantity = quantity;
    this.quantityUnity = quantityUnity;
  }
}

function appendImage(url, index) {
  const div = document.createElement("div");
  const removeImgBtn = document.createElement("button");
  const img = document.createElement("img");

  div.setAttribute("class", "recipe-image-container");

  removeImgBtn.setAttribute("class", "remove-recipe-image-btn");
  removeImgBtn.setAttribute("type", "button");
  removeImgBtn.onclick = () => {
    recipeImagesContainer.removeChild(div);
    recipeImages.splice(index, 1);
  };
  removeImgBtn.innerHTML = '<i class="lni lni-cross-circle"></i>';

  img.src = url;
  img.onload = function () {
    URL.revokeObjectURL(url);
  };
  img.setAttribute("class", "recipe-image");

  div.appendChild(img);
  div.appendChild(removeImgBtn);

  recipeImagesContainer.appendChild(div);
}

function addIngredientComponent() {
  const ingredientComponent = createIngredientComponent();
  ingredientsContainer.appendChild(ingredientComponent);
}

function createIngredientComponent() {
  const fieldset = document.createElement("fieldset");

  const ingredientNameFormRow = createIngredientNameComponent();
  const ingredientQuantityUnityFormRow =
    createIngredientQuantityUnityComponent();
  const ingredientQuantityFormrow = createIngredientQuantityComponent();

  const ingredient = new Ingredient();
  const ingredientIndex = ingredients.length;

  ingredients.push(ingredient);

  ingredientNameFormRow.onchange = (e) => {
    ingredient.name = e.target.value;
  };

  ingredientQuantityFormrow.onchange = (e) => {
    ingredient.quantity = Number(e.target.value);
  };
  ingredientQuantityUnityFormRow.onchange = (e) => {
    ingredient.quantityUnity = e.target.value;
  };

  const legend = document.createElement("legend");
  legend.textContent = "Ingrediente";

  fieldset.setAttribute("class", "ingredient-container");
  fieldset.appendChild(legend);
  fieldset.appendChild(ingredientNameFormRow);
  fieldset.appendChild(ingredientQuantityFormrow);
  fieldset.appendChild(ingredientQuantityUnityFormRow);

  const removeIngredientBtn = document.createElement("button");
  removeIngredientBtn.textContent = "Remover ingrediente";
  removeIngredientBtn.setAttribute("class", "remove-ingredient-btn");
  removeIngredientBtn.onclick = () => {
    ingredientsContainer.removeChild(fieldset);
    ingredients.splice(ingredientIndex, 1);
  };

  fieldset.appendChild(removeIngredientBtn);

  return fieldset;
}

function getFormData() {
  const name = recipeNameInput.value;
  const prepareTime = Number(prepareTimeInput.value);
  const description = recipeDescriptionInput.value;
  const preparationInstructions = preparationInstructionsInput.value;
  const servings = Number(recipeServingsInput.value);
  const nutritionalValue = Number(nutritionalValueInput.value);
  const cookingMethod = cookingMethodInput.value;

  return {
    name,
    prepareTime,
    description,
    preparationInstructions,
    servings,
    nutritionalValue,
    cookingMethod,
  };
}

function createFormDataObject(data, images) {
  const formData = new FormData();

  for (const [key, value] of Object.entries(data)) {
    formData.append(key, value);
  }

  for (const image of images) {
    formData.append("files", image, image.name);
  }

  return formData;
}

function hideCategoriesResultsContainer() {
  if (categoriesResultsContainer.classList.contains("hide")) {
    return;
  }
  categoriesResultsContainer.classList.add("hide");
}

function showCategoriesResultsContainer() {
  if (!categoriesResultsContainer.classList.contains("hide")) {
    return;
  }
  categoriesResultsContainer.classList.remove("hide");
}

async function createRecipe() {
  if (ingredients.length < 1) {
    return showToast("Pelo menos 1 ingrediente deve ser informado!");
  }
  const formData = getFormData();
  const data = {
    ...formData,
    ingredients: JSON.stringify(ingredients),
  };

  const formDataObject = createFormDataObject(data, recipeImages);
  formDataObject.append(
    "categories",
    JSON.stringify(selectedCategories.map((c) => c.id))
  );

  const response = await fetch("/api/v1/recipes/create", {
    method: "POST",
    body: formDataObject,
  });

  if (response.status !== 201) {
    return showToast("Erro ao criar receita!");
  }

  const json = await response.json();
  setGlobalMessage(json.data.id, "Receita criada com sucesso!");
  redirect("/receitas/" + json.data.id);
}

async function getCategoriesList() {
  const allCategories = await fetchCategories();
  categories = allCategories;
}

function appendCategoriesResults(filteredCategories) {
  const categoriesListItems = filteredCategories.map((category) =>
    createCategoryListItemComponent(category.name, () => {
      hideCategoriesResultsContainer();
      categoryInput.value = "";
      const alreadyExists = selectedCategories.some(
        (c) => c.id === category.id
      );
      if (alreadyExists) return;
      selectedCategories.push(category);
      refreshSelectedCatergoriesContainer();
    })
  );

  categoriesResultsContainer.innerHTML = "";

  if (categoriesListItems.length > 0) {
    categoriesListItems.forEach((categoryListItem) => {
      categoriesResultsContainer.appendChild(categoryListItem);
    });
  } else {
    const noResultsSpan = document.createElement("span");
    noResultsSpan.setAttribute("class", "no-results-span");
    noResultsSpan.textContent = "Nenhum resultado";
    categoriesResultsContainer.appendChild(noResultsSpan);
  }
}

function filterCategories(term) {
  const filteredCategories = categories.filter((category) =>
    category.name.toUpperCase().includes(term.toUpperCase())
  );
  appendCategoriesResults(filteredCategories);
}

function refreshSelectedCatergoriesContainer() {
  selectedCategoriesContainer.innerHTML = "";
  const selectedCategoriesComponentsList = selectedCategories.map(
    (category) => {
      return createSelectedCategoryComponent(category, (categoryData) => {
        selectedCategories = selectedCategories.filter(
          (c) => c.id !== categoryData.id
        );
        refreshSelectedCatergoriesContainer();
      });
    }
  );

  if (selectedCategories.length > 0) {
    selectedCategoriesComponentsList.forEach((c) =>
      selectedCategoriesContainer.appendChild(c)
    );
  } else {
    selectedCategoriesContainer.innerHTML =
      '<span class="no-categories-selected-label">Nenhuma categoria selecionada</span>';
  }
}

categoryInput.addEventListener("input", (e) =>
  filterCategories(e.target.value)
);

categoryInput.addEventListener("focus", () => {
  showCategoriesResultsContainer();
});

imageInput.addEventListener("change", () => {
  const selectedFile = imageInput.files[0];
  const imageURL = URL.createObjectURL(selectedFile);

  const imgIndex = recipeImages.length;
  recipeImages.push(selectedFile);

  appendImage(imageURL, imgIndex);

  imageInput.value = "";
});

addIngredientButton.addEventListener("click", () => {
  addIngredientComponent();
});

newRecipeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  createRecipe();
});

getCategoriesList();
