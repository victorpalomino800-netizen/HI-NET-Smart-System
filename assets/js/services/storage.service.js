const SESSION_KEY = "hinet_session";
const REMEMBERED_EMAIL_KEY = "hinet_remembered_email";

export function saveSession(user) {
  sessionStorage.setItem(
    SESSION_KEY,
    JSON.stringify({
      email: user.email,
      role: user.role,
      name: user.name
    })
  );
}

export function getSession() {
  const rawSession = sessionStorage.getItem(SESSION_KEY);

  if (!rawSession) {
    return null;
  }

  try {
    return JSON.parse(rawSession);
  } catch (error) {
    console.error("No se pudo leer la sesión local:", error);
    sessionStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
}

export function saveRememberedEmail(email) {
  localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
}

export function getRememberedEmail() {
  return localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? "";
}

export function clearRememberedEmail() {
  localStorage.removeItem(REMEMBERED_EMAIL_KEY);
}
