var emVal = parseFloat(getComputedStyle(document.body).fontSize);
var main_nav = document.getElementById("main-nav");
var underline = document.getElementById("underline");
var workspaces = document.querySelectorAll(".workspace-tab");
var list_items  = document.querySelectorAll("#main-nav li");
var chevrons = document.querySelectorAll(".show-code");
var _data;

for (let x of document.querySelectorAll("div.line")) {
    x.onmouseover = (e) => {if (e.target.className === "line") {e.target.style.width = e.target.children[1].offsetWidth + (emVal * 4) + "px"}};
    x.onmouseleave = (e) => {if (e.target.className === "line") {e.target.style.width = ""}};
}

function toEle(e) {
  let containerRect = main_nav.getBoundingClientRect(),
  elemRect = e.getBoundingClientRect(),
  x = elemRect.left - containerRect.left - 1,
  y = elemRect.top - containerRect.top - 1,
  w = elemRect.width,
  h = elemRect.height;
  underline.style.left = x + "px";
  underline.style.top = y + "px";
  underline.style.width = w - (emVal * 2) + 4 + "px";
  underline.style.height = h - (emVal * 2) + 4 + "px";
}

for (let li of list_items) {
  li.onmouseover = (e) => {toEle(e.target)};
  li.onclick = workspaceSelect;
}

main_nav.onmouseleave = window.onresize = () => {
  toEle(document.querySelector(".selected-li"));
};
toEle(document.querySelector(".selected-li"));

for (let chevron of chevrons) {
  chevron.onclick = (e) => {
    if (e.target.style.transform === "") {
      for (let x of chevrons) {x.style.transform = "";}
      e.target.style.transform = "rotate(180deg)";
  
      for (let x of document.querySelector("#source-code").children) {x.style.display = "none";}
      document.getElementById(e.target.getAttribute("code")).style.display = "block";
    }
    else {
      e.target.style.transform = "";
      document.getElementById(e.target.getAttribute("code")).style.display = "none";
    }
  }
};

function workspaceSelect(e) {
  for (let workspace of workspaces) {workspace.style.display = "none";}

  document.getElementById(e.target.getAttribute("menuID")).style.display = "block";

  for (let li of list_items) {li.className = ""};
  e.target.className = "selected-li";
}

function colNum() {
  if (window.outerWidth <= 600) {
    return 1;
  } else {
    return Math.floor(((window.outerWidth - 600) / 300) + 1);
  }
}

fetch("/search/data.json")
  .then(response => response.json())
  .then(data => {
    var row = document.querySelector(".imgrow");
    function calcCols() {
      var cols = colNum();

      while (row.firstChild) {row.firstChild.remove()};

      for (let y = 0; y < cols; y++) {
        let col = document.createElement("div");
        col.className = "imgcolumn";
        row.appendChild(col);
      }
      var imgcolumns = document.querySelectorAll(".imgcolumn");

      for (let [i, d] of data.entries()) {
        d = d.pages[0];
        let img = document.createElement("img");
        let a = document.createElement("a");
        img.src = "/gallery/thumbs/" + d.file + ".png";
        img.alt = d.name;
        a.href = "/image/?i=" + d.file;
        a.appendChild(img);
        imgcolumns[i % cols].appendChild(a);
      };

      for (let _col of imgcolumns) {
        _col.style.flex = (100 / cols) + "%";
        _col.style.maxWidth = "calc(" + (100 / cols) + "% - 0.5em)";
      }
    };
    window.onorientationchange = row.onresize = calcCols;
    calcCols();
  })
  .catch((e) => console.log("Error fetching data\n" + e));