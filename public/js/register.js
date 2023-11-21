const MINIMUM_AGE = 13;

const FETCH_BRAZIL_STATES_IBGE_API_URL =
  "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome";
const FETCH_BRAZIL_CITIES_BY_STATE_API_URL =
  "https://servicodados.ibge.gov.br/api/v1/localidades/estados/{state_id}/municipios?orderBy=nome";

const showPasswordCheckbox = document.getElementById("show-password-checkbox");
const selectStateElement = document.getElementById("state-select");
const selectCityElement = document.getElementById("city-select");

const passwordConfirmInput = document.getElementById("password-confirm-input");
const passwordInput = document.getElementById("password-input");
const emailInput = document.getElementById("email-input");
const nameInput = document.getElementById("name-input");
const birthDateInput = document.getElementById("birth-date-input");
const phoneInput = document.getElementById("phone-input");
const registerForm = document.getElementById("form-register");

const nameError = document.getElementById("name-error");
const emailError = document.getElementById("email-error");
const birthDateError = document.getElementById("birth-date-error");
const passwordError = document.getElementById("password-error");
const phoneError = document.getElementById("phone-error");

async function fetchBrazilStates() {
  const response = await fetch(FETCH_BRAZIL_STATES_IBGE_API_URL);
  const json = await response.json();
  return json;
}

async function fetchBrazilCitiesByState(stateId) {
  const url = FETCH_BRAZIL_CITIES_BY_STATE_API_URL.replace(
    "{state_id}",
    stateId
  );
  const response = await fetch(url);
  const json = await response.json();
  return json;
}

async function loadStates() {
  const states = await fetchBrazilStates();
  states.forEach((state) => {
    selectStateElement.innerHTML += createStateSelectOption(
      state.nome,
      state.id
    );
  });
  loadCitiesFromStateId(states[0].id);
}

async function loadCitiesFromStateId(stateId) {
  const cities = await fetchBrazilCitiesByState(stateId);
  selectCityElement.innerHTML = "";

  cities.forEach((city) => {
    selectCityElement.innerHTML += createCitySelectOption(city.nome);
  });
}

function toggleShowPassword() {
  if (passwordInput.type == "text") {
    passwordInput.type = "password";
    passwordConfirmInput.type = "password";
  } else {
    passwordInput.type = "text";
    passwordConfirmInput.type = "text";
  }
}

function showFormErrors(errors) {
  if (errors.name && nameError.classList.contains("hide")) {
    nameError.classList.remove("hide");
    nameError.querySelector("span").textContent = errors.name;
  }

  if (errors.email && emailError.classList.contains("hide")) {
    emailError.classList.remove("hide");
    emailError.querySelector("span").textContent = errors.email;
  }

  if (errors.birthDate && birthDateError.classList.contains("hide")) {
    birthDateError.classList.remove("hide");
    birthDateError.querySelector("span").textContent = errors.birthDate;
  }

  if (errors.password && passwordError.classList.contains("hide")) {
    passwordError.classList.remove("hide");
    passwordError.querySelector("span").textContent = errors.password;
  }

  if (errors.phone && phoneError.classList.contains("hide")) {
    phoneError.classList.remove("hide");
    phoneError.querySelector("span").textContent = errors.phone;
  }
}

function hideFormErrors() {
  if (!nameError.classList.contains("hide")) {
    nameError.classList.add("hide");
    nameError.querySelector("span").textContent = "";
  }

  if (!emailError.classList.contains("hide")) {
    emailError.classList.add("hide");
    emailError.querySelector("span").textContent = "";
  }

  if (!birthDateError.classList.contains("hide")) {
    birthDateError.classList.add("hide");
    birthDateError.querySelector("span").textContent = "";
  }

  if (!passwordError.classList.contains("hide")) {
    passwordError.classList.add("hide");
    passwordError.querySelector("span").textContent = "";
  }

  if (!phoneError.classList.contains("hide")) {
    phoneError.classList.add("hide");
    phoneError.querySelector("span").textContent = "";
  }
}

function checkMinimumAge(dateOfBirth, age) {
  const birthDate = new Date(dateOfBirth);
  const currentDate = new Date();

  const differenceMilliseconds = currentDate - birthDate;

  const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365.25;
  const ageInYears = differenceMilliseconds / millisecondsPerYear;

  return ageInYears >= age;
}

async function validateFormData(data) {
  const containNumberRegex = /\d/g;
  const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).*$/;

  const errors = {};
  const [isEmailAvailableResponse, isPhoneAvailableResponse] =
    await Promise.all([
      await post(
        "/api/v1/users/email/availability",
        JSON.stringify({ email: data.email })
      ),
      await post(
        "/api/v1/users/phone/availability",
        JSON.stringify({ phone: data.phone })
      ),
    ]);

  if (!isEmailAvailableResponse.data.available) {
    errors.email = "E-mail já existe!";
  }

  if (!isPhoneAvailableResponse.data.available) {
    errors.phone = "Telefone já existe!";
  }

  if (data.password !== data.passwordConfirm) {
    errors.password = "Senhas não coincidem!";
  }

  if (!data.password.match(strongPasswordRegex)) {
    errors.password =
      "A senha deve conter pelo menos 1 letra maiúscula, 1 caractere especial, 1 digito e 1 letra minúscula.";
  }

  if (data.name.match(containNumberRegex)) {
    errors.name = "O nome só pode conter letras e espaços em branco!";
  }

  if (!checkMinimumAge(data.birthDate, MINIMUM_AGE)) {
    errors.birthDate = `Você precisar ter pelo menos ${MINIMUM_AGE} anos para se cadastrar`;
  }

  return Object.keys(errors).length > 0 ? errors : null;
}

function getFormData() {
  const passwordConfirm = passwordConfirmInput.value;
  const password = passwordInput.value;
  const email = emailInput.value;
  const birthDate = birthDateInput.value;
  const phone = phoneInput.value;
  const name = nameInput.value.toUpperCase();

  const stateId = selectStateElement.value;

  const state = selectStateElement
    .querySelector(`option[value="${stateId}"]`)
    .dataset.state.toUpperCase();
  const city = selectCityElement.value.toUpperCase();

  return {
    password,
    passwordConfirm,
    name,
    email,
    birthDate,
    phone,
    state,
    city,
  };
}

async function register() {
  hideFormErrors();
  const formData = getFormData();
  const errors = await validateFormData(formData);

  if (errors) {
    return showFormErrors(errors);
  }
  await post("/api/v1/users/register", JSON.stringify(formData));
  redirect("/");
}

selectStateElement.addEventListener("change", () => {
  const stateId = selectStateElement.value;
  loadCitiesFromStateId(stateId);
});

showPasswordCheckbox.addEventListener("change", (e) => {
  toggleShowPassword();
});

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  register();
});

loadStates();
