import {
  authenticateDemoUser,
  completeLogin,
  getSavedEmail
} from "./auth.js";
import { setButtonLoading, setMessage } from "./ui.js";
import { qs, qsa } from "./utils/dom.js";

const loginForm = qs("#loginForm");
const emailInput = qs("#email");
const passwordInput = qs("#password");
const rememberMe = qs("#rememberMe");
const togglePassword = qs("#togglePassword");
const submitButton = qs("#submitButton");
const loginMessage = qs("#loginMessage");
const emailError = qs("#emailError");
const passwordError = qs("#passwordError");
const forgotPasswordButton = qs("#forgotPasswordButton");
const forgotPasswordDialog = qs("#forgotPasswordDialog");
const recoveryEmail = qs("#recoveryEmail");
const sendRecoveryButton = qs("#sendRecoveryButton");

const savedEmail = getSavedEmail();

if (savedEmail) {
  emailInput.value = savedEmail;
  rememberMe.checked = true;
}

qsa(".demo-user").forEach((button) => {
  button.addEventListener("click", () => {
    emailInput.value = button.dataset.email;
    passwordInput.value = button.dataset.password;
    emailInput.focus();
  });
});

togglePassword.addEventListener("click", () => {
  const shouldShowPassword = passwordInput.type === "password";

  passwordInput.type = shouldShowPassword ? "text" : "password";
  togglePassword.textContent = shouldShowPassword ? "Ocultar" : "Ver";
  togglePassword.setAttribute(
    "aria-label",
    shouldShowPassword ? "Ocultar contraseña" : "Mostrar contraseña"
  );
});

forgotPasswordButton.addEventListener("click", () => {
  recoveryEmail.value = emailInput.value.trim();
  forgotPasswordDialog.showModal();
});

sendRecoveryButton.addEventListener("click", (event) => {
  event.preventDefault();

  const email = recoveryEmail.value.trim();

  if (!email || !email.includes("@")) {
    window.alert("Ingresa un correo válido.");
    return;
  }

  window.alert(
    "Flujo local completado. La recuperación real se conectará con Supabase Auth."
  );
  forgotPasswordDialog.close();
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  emailError.textContent = "";
  passwordError.textContent = "";
  setMessage(loginMessage, "");

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  let hasErrors = false;

  if (!email || !email.includes("@")) {
    emailError.textContent = "Ingresa un correo electrónico válido.";
    hasErrors = true;
  }

  if (!password || password.length < 6) {
    passwordError.textContent = "La contraseña debe tener al menos 6 caracteres.";
    hasErrors = true;
  }

  if (hasErrors) {
    return;
  }

  setButtonLoading(submitButton, true, "Validando...");
  setMessage(loginMessage, "Comprobando credenciales...");

  await new Promise((resolve) => setTimeout(resolve, 650));

  const user = authenticateDemoUser(email, password);

  if (!user) {
    setButtonLoading(submitButton, false);
    setMessage(
      loginMessage,
      "Credenciales incorrectas. Revisa el correo y la contraseña.",
      "error"
    );
    return;
  }

  setMessage(loginMessage, `Bienvenido, ${user.name}.`, "success");

  setTimeout(() => {
    completeLogin(user, rememberMe.checked);
  }, 350);
});
