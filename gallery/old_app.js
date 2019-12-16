function workspaceSelect(e) {
  let i = 0;
  let elem = e.target;
  while((elem=elem.previousSibling)!=null) {i++};
  w.style.transform = "translateX(" + -i + "00vw)";
  pageID = i;

  for (let li of list_items) {li.className = ""};
  e.target.className = "selected-li";
}

let about = document.createElement("li");
about.innerHTML = "About";
main_nav.appendChild(about);

for (let d of data) {
  d = d.pages[0];
  let li = document.createElement("li");

  let s = Array.from(d.file); s[0] = s[0].toUpperCase();
  for (let x = 0; x < s.length; x++) {if (s[x] === "_") {s[x] = " "; s[x + 1] = s[x + 1].toUpperCase();}}
  li.innerHTML = s.join("");

  main_nav.appendChild(li);
}
for (const li of list_items) {li.onclick = workspaceSelect};

main_nav.firstChild.className = "selected-li";
let movBorder = document.createElement("div");
movBorder.id = "moving-border";
main_nav.appendChild(movBorder);

main_nav.addEventListener("pointerover", function(evt) {
  evt.preventDefault();
    var e = evt.target;
    if (e.tagName == "LI" && e.parentNode.id == "main-nav") {
      requestAnimationFrame(() => {
        var containerRect = main_nav.getBoundingClientRect(),
        elemRect = e.getBoundingClientRect(),
        x = elemRect.left - containerRect.left,
        y = elemRect.top - containerRect.top - 1,
        w = elemRect.width,
        h = elemRect.height;
        movBorder.style.left = x + "px";
        movBorder.style.top = y + "px";
        movBorder.style.width = w - (emVal * 2) + "px";
        movBorder.style.height = h - (emVal * 2) + "px";
        movBorder.style.borderColor = "#777";
      });
    }
}, false);

main_nav.onpointerleave = () => {movBorder.style.borderColor = "transparent"};