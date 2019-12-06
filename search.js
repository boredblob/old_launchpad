function __search() {
  if (event.code == "Enter") {
    window.location.href = "/search?s=" + document.querySelector(".searchbar").value;
  }
}
console.log("search loaded");