var main_nav = document.querySelector("#main-nav");
var desc_container = document.querySelector("#desc-container");
var emVal = parseFloat(getComputedStyle(document.body).fontSize);
var workspaces = document.getElementsByClassName("workspace-tab");
var list_items = main_nav.getElementsByTagName("li");
var descriptions = document.getElementsByClassName("desc");


fetch("https://am-i.cool/search/data.json")
.then(response => response.json())
.then(data => {
  
  for (let i of data) {
    let li = document.createElement("li");
    li.onclick = () => {workspaceSelect(event.target)};

    let s = Array.from(i.file); s[0] = s[0].toUpperCase();
    for (let x = 0; x < s.length; x++) {if (s[x] === "_") {s[x] = " "; s[x + 1] = s[x + 1].toUpperCase();}}
    li.innerHTML = s.join("");

    main_nav.appendChild(li);
  }
  main_nav.firstChild.className = "selected-li";
  let movBorder = document.createElement("div");
  movBorder.id = "moving-border";
  main_nav.appendChild(movBorder);


  for (let i of data) {
    let descBox = document.createElement("div");
    let descBoxH3 = document.createElement("h3");
    let descBoxP = document.createElement("p");

    descBoxH3.className = "title";
    descBoxH3.innerHTML = i.name;
    descBoxP.className = "caption";
    descBoxP.innerHTML = i.description;
    descBox.className = "desc";
    descBox.id = i.file;

    descBox.appendChild(descBoxH3);
    descBox.appendChild(descBoxP);
    desc_container.appendChild(descBox);
  }
  

  main_nav.onmouseover = (event) => {
      var e = event.target;
      if (e.tagName == "LI" && e.parentNode.id == "main-nav") {
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
      }
  };

  main_nav.onmouseleave = window.onresize = () => {movBorder.style.borderColor = "transparent"};


  function new_tab(id) {
    var imgbox = document.getElementById("imgbox");
    var img = document.createElement("img");
    
    for (let item of imgbox.children) {item.remove();}
    img.src = id + ".png";
    img.className = "image";
    imgbox.appendChild(img);
  }

  function workspaceSelect(e) {
    var id = e.innerHTML.toLowerCase().replace(" ", "_");

    for (let workspace of workspaces) {workspace.style.display = "none";}
    for (let desc of descriptions) {desc.style.display = "none";}
    for (let item of list_items) {item.className = "";}

    if (id == "about") {workspaces[0].style.display = "block";} else {workspaces[1].style.display = "flex"; new_tab(id);}
    
    e.className = "selected-li"; 
    document.getElementById(id).style.display = "block";
  }
})
.catch((e) => {console.log("Error: " + e);});