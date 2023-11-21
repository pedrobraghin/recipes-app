const showPasswordCheckbox = document.getElementById("show-password-checkbox");
const formLogin = document.getElementById("form-login");
const errorContainer = document.getElementById("error-container");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const submitBtn = document.getElementById("submit-btn");

showPasswordCheckbox.addEventListener("change", (e) => {
  toggleShowPassword();
});

function toggleShowPassword() {
  if (passwordInput.type == "text") {
    passwordInput.type = "password";
  } else {
    passwordInput.type = "text";
  }
}

formLogin.addEventListener("submit", (e) => {
  e.preventDefault();
  login();
});

async function login() {
  try {
    hideLoginErrorMessage();
    toggleLoading(true, "Carregando");

    const email = emailInput.value;
    const password = passwordInput.value;

    const response = await fetch("api/v1/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    setTimeout(() => toggleLoading(false, "Entrar"), 5000);

    if (response.status === 401) {
      return showLoginErrorMessage();
    }

    setGlobalMessage("home", "Login realizado com sucesso!");

    const queryParams = getQueryParams();
    const redirectUrl = queryParams.get("r") ?? "/";

    redirect(redirectUrl);
  } catch (e) {
    showLoginErrorMessage();
  }
}

function hideLoginErrorMessage() {
  errorContainer.classList.add("hide");
}

function showLoginErrorMessage() {
  errorContainer.classList.remove("hide");
  errorContainer.querySelector("span").textContent =
    "E-mail ou senha incorretos.";
}

function toggleLoading(state, text) {
  submitBtn.disabled = state;
  submitBtn.value = text;
}
