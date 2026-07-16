export function setMessage(element, message, type = "neutral") {
  element.textContent = message;
  element.classList.remove("is-error", "is-success");

  if (type === "error") {
    element.classList.add("is-error");
  }

  if (type === "success") {
    element.classList.add("is-success");
  }
}

export function setButtonLoading(button, loading, loadingText = "Procesando...") {
  if (!button.dataset.originalText) {
    button.dataset.originalText = button.innerHTML;
  }

  button.disabled = loading;
  button.classList.toggle("is-loading", loading);
  button.innerHTML = loading ? loadingText : button.dataset.originalText;
}

export function getInitials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
}
