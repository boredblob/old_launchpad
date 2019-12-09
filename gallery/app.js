fetch("https://am-i.cool/search/data.json", {
  cache: "no-cache"
})
.then(response => response.json())
.then(data => {
  let main_nav = document.querySelector("#main-nav");
  for (let i of data) {
    let li = document.createElement("li");
    li.onclick = () => {workspaceSelect(event.target)};

    let s = Array.from(i.file); s[0] = s[0].toUpperCase();
    for (let x = 0; x < s.length; x++) {if (s[x] === "_") {s[x] = " "; s[x + 1] = s[x + 1].toUpperCase();}}
    li.innerHTML = s.join("");

    main_nav.appendChild(li);
  }
  main_nav.firstChild.className = "selected-li";
  let mb = document.createElement("div");
  mb.id = "moving-border";
  main_nav.appendChild(mb);

  let desc_container = document.querySelector("#desc-container");
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
  

  var border_ = document.getElementById("moving-border");
  var emVal = parseFloat(getComputedStyle(document.body).fontSize);

  main_nav.addEventListener("mouseover", function( event ) {
      var e = event.target;
      if (e.tagName == "LI" && e.parentNode.id == "main-nav") {
          var containerRect = main_nav.getBoundingClientRect(),
          elemRect = e.getBoundingClientRect(),
          x = elemRect.left - containerRect.left - 1,
          y = elemRect.top - containerRect.top - 1,
          w = elemRect.width,
          h = elemRect.height;
          border_.style.left = x + "px";
          border_.style.top = y + "px";
          border_.style.width = w - (emVal * 2) + "px";
          border_.style.height = h - (emVal * 2) + "px";
          border_.style.borderColor = "#777";
      }
  }, false);

  function makeTransparent() {
      border_.style.borderColor = "transparent";
  }

  main_nav.addEventListener("mouseleave", makeTransparent, false);
  window.onresize = makeTransparent;




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
    var workspaces = document.getElementsByClassName("workspace-tab");

    for (let workspace of workspaces) {
        workspace.style.display = "none";
    }
    if (id == "about") {workspaces[0].style.display = "block";} else {workspaces[1].style.display = "flex"; new_tab(id);}

    list_items = document.getElementById("main-nav").getElementsByTagName("li");
    for (let item of list_items) {
        item.className = "";
    }
    e.className = "selected-li";
    
    var descriptions = document.getElementsByClassName("desc");
    for (let desc of descriptions) {
        desc.style.display = "none";
    }
    document.getElementById(id).style.display = "block";
  }
})
.catch((e) => {console.log("Error: " + e);});