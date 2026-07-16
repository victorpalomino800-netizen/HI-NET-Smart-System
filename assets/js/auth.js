import { ROUTES } from "./config.js";
import {
  clearRememberedEmail,
  clearSession,
  getRememberedEmail,
  getSession,
  saveRememberedEmail,
  saveSession
} from "./services/storage.service.js";

const DEMO_USERS = [
  {
    email: "admin@hinet.com",
    password: "123456",
    role: "administrator",
    name: "Administrador HI-NET"
  },
  {
    email: "tecnico@hinet.com",
    password: "123456",
    role: "technician",
    name: "Víctor Técnico"
  },
  {
    email: "cliente@hinet.com",
    password: "123456",
    role: "client",
    name: "Alejandro Cliente"
  }
];

export function authenticateDemoUser(email, password) {
  const normalizedEmail = email.trim().toLowerCase();

  return (
    DEMO_USERS.find(
      (user) =>
        user.email === normalizedEmail &&
        user.password === password
    ) ?? null
  );
}

export function completeLogin(user, rememberEmail) {
  saveSession(user);

  if (rememberEmail) {
    saveRememberedEmail(user.email);
  } else {
    clearRememberedEmail();
  }

  window.location.href = ROUTES[user.role];
}

export function getSavedEmail() {
  return getRememberedEmail();
}

export function requireRole(requiredRole, loginPath = "../../index.html") {
  const session = getSession();

  if (!session || session.role !== requiredRole) {
    window.location.replace(loginPath);
    return null;
  }

  return session;
}

export function logout(loginPath = "../../index.html") {
  clearSession();
  window.location.replace(loginPath);
}
