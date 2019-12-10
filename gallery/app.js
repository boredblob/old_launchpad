var main_nav = document.querySelector("#main-nav");
var g_tab = document.querySelector("#gallery-tab");
var emVal = parseFloat(getComputedStyle(document.body).fontSize);
var workspaces = document.getElementsByClassName("workspace-tab");
var list_items = main_nav.getElementsByTagName("li");


fetch("/search/data.json")
.then(response => response.json())
.then(data => {
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
  for (const li of list_items) {li.onclick = () => {workspaceSelect(event.target)}};

  main_nav.firstChild.className = "selected-li";
  let movBorder = document.createElement("div");
  movBorder.id = "moving-border";
  main_nav.appendChild(movBorder);
  

  main_nav.onmouseover = main_nav.ontouchstart = main_nav.ontouchmove = (event) => {
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

  main_nav.onmouseleave = main_nav.ontouchend  = window.onresize = () => {movBorder.style.borderColor = "transparent"};


  function new_tab(id) {
    while (g_tab.firstChild) {g_tab.firstChild.remove()};

    var d;
    for (const i of data) {
      d = (i.pages[0].file === id) ? i : d;
    };

    if (d !== undefined) {
      for (const [i, page] of d.pages.entries()) {
        var _page = document.createElement("div");
        _page.className = "image-page";
        g_tab.appendChild(_page);

        var img = document.createElement("img");
        
        img.src = page.file + ".png";
        img.className = "image";
        _page.appendChild(img);
    
    
        let descBox = document.createElement("div");
        let descBoxP = document.createElement("p");

        if (i === 0) {
          let descBoxH3 = document.createElement("h3");
          descBoxH3.className = "title";
          descBoxH3.innerHTML = d.name;
          descBox.appendChild(descBoxH3);
        };
    
        descBoxP.className = "caption";
        descBoxP.innerHTML = page.description;
        descBox.className = "desc";
        
        descBox.appendChild(descBoxP);
        _page.appendChild(descBox);
      }
    } else {
      let Error = document.createElement(p);
      Error.innerHTML = "No data found."
      g_tab.appendChild(Error);
    }
  }

  function workspaceSelect(e) {
    if (!e.className) {
      var id = e.innerHTML.toLowerCase().replace(" ", "_");

      for (let workspace of workspaces) {workspace.style.display = "none";}
      for (let item of list_items) {item.className = "";}
  
      if (id == "about") {workspaces[0].style.display = "block";} else {workspaces[1].style.display = "flex"; new_tab(id)}
      
      e.className = "selected-li";
    }
  }
})
.catch((e) => {console.log("Error: " + e);});