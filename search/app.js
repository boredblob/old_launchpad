var results = document.querySelector("main .results");
var search = decodeURI(window.location.href.split("?")[1].split("s=")[1].split("&")[0]);
var searchbar = document.querySelector("main .searchbar")
searchbar.value = search;

while (results.firstChild) {results.firstChild.remove();};


fetch("data.json")
.then(response => response.json())
.then(data => {
  var options = {
    keys: [{
      name: 'name',
      weight: 0.7
    }, {
      name: 'tags',
      weight: 0.2
    }, {
      name: 'description',
      weight: 0.1
    }]
  };
  let fuse = new Fuse(data, options);


  if (search !== undefined) {
    searchResult = fuse.search(searchbar.value);
    
    if (searchResult.length > 0) {
      var i = 1;
      for (let r of searchResult) {
        let result = document.createElement("div");
        let text = document.createElement("a");
        text.className = "dark";
        text.href = "/image?i=" + r.file;
        text.innerHTML = r.name;
        result.className = "result";
        result.style.transitionDuration = ((i * 2) / 10) + "s";
        result.appendChild(text);
        results.appendChild(result);
        i++;
      };
      setTimeout(() => {for (let r of results.children) {r.style.opacity = "1"}}, 10);
    }
    else {
      let p = document.createElement("p");
      p.innerHTML = "No results"
      results.appendChild(p);
    }
  }
})
.catch((e) => console.log("Error fetching search data\n" + e));