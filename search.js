function __search() {
  window.location.href = "/search/?s=" + document.querySelector(".searchbar").value;
  return false;
}