var emVal = parseFloat(getComputedStyle(document.body).fontSize);
var main_nav = document.getElementById("main-nav");
var underline = document.getElementById("underline");
var list_items  = document.querySelectorAll("#main-nav li");
var chevrons = document.querySelectorAll(".show-code");
var _data;
const w = document.querySelector(".workspace");
var pageID = 0;

for (let x of document.querySelectorAll("div.line")) {
  x.onmouseover = (e) => {requestAnimationFrame(() => {
    if (e.target.className === "line") {
      e.target.style.width = e.target.children[1].offsetWidth + (emVal * 4) + "px";
    }
  })};
  x.onmouseleave = (e) => {requestAnimationFrame(() => {
    if (e.target.className === "line") {
      e.target.style.width = "";
    }
  })};
}

function toEle(e) {requestAnimationFrame(() => {
    let containerRect = main_nav.getBoundingClientRect(),
    elemRect = e.getBoundingClientRect(),
    x = elemRect.left - containerRect.left - 1,
    w = elemRect.width;
    underline.style.left = x + "px";
    underline.style.width = w - (emVal * 2) + 4 + "px";
  })
}

for (let li of list_items) {
  li.onmouseover = (e) => {toEle(e.target)};
  li.onclick = workspaceSelect;
}

main_nav.onmouseleave = () => {
  toEle(document.querySelector(".selected-li"));
}; //set lower down at other onresize
toEle(document.querySelector(".selected-li"));

for (const chevron of chevrons) {
  chevron.onclick = (e) => {
    const code = document.getElementById(e.target.getAttribute("code"));
    requestAnimationFrame(() => {
    if (e.target.style.transform === "") {
      for (let x of chevrons) {x.style.transform = "";}
      e.target.style.transform = "rotate(180deg)";

      for (let x of document.querySelector("#source-code").children) {x.style.display = "none";}
      code.style.display = "block";
    }
    else {
      e.target.style.transform = "";
      code.style.display = "none";
    }
  }
)}};

function workspaceSelect(e) {
  let i = 0;
  let elem = e.target;
  while((elem=elem.previousSibling)!=null) {i++};
  i = Math.floor(i / 2);
  w.style.transform = "translateX(" + -i + "00vw)";
  pageID = i;

  for (let li of list_items) {li.className = ""};
  e.target.className = "selected-li";
}

function colNum() {
  if (window.outerWidth <= 600) {
    return 1;
  } else {
    return Math.floor(((window.outerWidth - 600) / 350) + 2);
  }
}

var oldcols;
fetch("/search/data.json")
  .then(response => response.json())
  .then(data => {
    var row = document.querySelector(".imgrow");
    function calcCols() {
      requestAnimationFrame(() => {
        var cols = colNum();
        if (oldcols !== cols) {
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
            img.loading = "lazy";
            a.href = "/image/?i=" + d.file;
            a.appendChild(img);
            imgcolumns[i % cols].appendChild(a);
          };
  
          for (let _col of imgcolumns) {
            _col.style.flex = (100 / cols) + "%";
            _col.style.maxWidth = "calc(" + (100 / cols) + "% - 0.5em)";
          }
          oldcols = cols;
        }
      })
    };
    var _width = window.innerWidth;
    window.onresize = () => {
      toEle(document.querySelector(".selected-li"));
      if (window.innerWidth !== _width) {
        calcCols();
        _width = window.width;
      }
    }
    calcCols();
  })
  .catch((e) => console.log("Error fetching data\n" + e));


function selectTab() {
  w.style.transform = 'translateX(' + -pageID + '00vw)';
  for (let li of list_items) {li.className = ""};
  list_items[pageID].className = "selected-li";
  toEle(document.querySelector(".selected-li"));
}

var initialTouchPosX = 0, currentPosX = 0;
var events = new Object;

function getGesturePointFromEvent(evt) {
  var x = 0;
  if(evt.targetTouches) {
    x = evt.targetTouches[0].clientX;
  } else {
    x = evt.clientX;
  }
  return x;
}

function onAnimFrame() {
  var newXTransform = (currentPosX - initialTouchPosX);
  var transformStyle = 'translateX(' + (newXTransform - (pageID * window.innerWidth)) + 'px)';
  w.style.transform = transformStyle;
}

function handleGestureMove(e) {
  e.preventDefault();
  currentPosX = getGesturePointFromEvent(e);
  requestAnimationFrame(onAnimFrame);
}

function handleGestureEnd(e) {
  e.preventDefault();
  w.style.transition = "all 0.3s ease-out";

  requestAnimationFrame(() => {
    if (Math.abs(currentPosX - initialTouchPosX) > window.innerWidth / 3) {
      window.scrollBy({
        top: -window.scrollY,
        behavior: 'smooth'
      });
      if (currentPosX - initialTouchPosX < 0) {
        if (pageID < 3) {
          pageID++;
        }
      } else {
        if (pageID > 0) {
          pageID--;
        }
      }
    }
    selectTab();
  });

  document.removeEventListener(events.move, handleGestureMove, true);
  document.removeEventListener(events.end, handleGestureEnd, true);
  document.removeEventListener(events.cancel, handleGestureEnd, true);
}

function handleGestureStart(e) {
  var text = [].reduce.call(e.target.childNodes, (a, b) => {return a + (b.nodeType === 3 ? b.textContent : '');}, '').trim();
  if (text === "" || e.pointerType !== "mouse") {
    e.preventDefault();
    w.style.transition = "initial";
    currentPosX = initialTouchPosX = getGesturePointFromEvent(e);
    document.addEventListener(events.move, handleGestureMove, true);
    document.addEventListener(events.end, handleGestureEnd, true);
    document.addEventListener(events.cancel, handleGestureEnd, true);
  }
}

if (window.PointerEvent) {
  w.addEventListener('pointerdown', this.handleGestureStart, true);
  events.move = "pointermove";
  events.end = "pointerup";
  events.cancel = "pointercancel";
} else {
  w.addEventListener('touchstart', this.handleGestureStart, true);
  events.move = "touchmove";
  events.end = "touchend";
  events.cancel = "touchcancel";
  w.addEventListener('mousedown', this.handleGestureStart, true);
}

function nextPage(left) {
  if (left) {pageID--;} else {pageID++;}
  if (pageID < 0 || pageID > 3) {
    var x = (pageID < 0) ? -window.innerWidth / 5 : window.innerWidth / 5;
    pageID = (pageID < 0) ? 0 : 3;
    requestAnimationFrame(() => {w.style.transform = 'translateX(' + ((-pageID * window.innerWidth) - x) + 'px)';});
    setTimeout(() => {requestAnimationFrame(selectTab);}, 300);
  } else {
    requestAnimationFrame(selectTab);
  }
}

window.onkeydown = (e) => {
  if (e.code === "ArrowLeft") {nextPage(true);}
  if (e.code === "ArrowRight") {nextPage(false);}
};