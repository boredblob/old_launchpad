var g_tab = document.querySelector("#gallery-tab");
var w = document.querySelector(".workspace");
var workspaces = document.getElementsByClassName("workspace-tab");
var _main = document.querySelector("#main");
var pageID = 0;
var pages_num = 0;


fetch("/search/data.json")
.then(response => response.json())
.then(data => {
  pages_num = data.length;
  w.style.width = ((pages_num + 1) * 100) +"vw";

  for (const d of data) {
    var w_tab = document.createElement("section");
    w_tab.className = "workspace-tab";
    for (const [i, page] of d.pages.entries()) {
      var _page = document.createElement("div");
      _page.className = "image-page";

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
        descBox.appendChild(document.createElement("br"));
      };
  
      descBoxP.className = "caption";
      descBoxP.innerHTML = page.description;
      descBox.className = "desc";
      
      descBox.appendChild(descBoxP);
      _page.appendChild(descBox);
      w_tab.appendChild(_page);
    }
    w.appendChild(w_tab);
  };
})
.catch((e) => {console.log("Error: " + e);});

const h = document.querySelector(".workspace-scroll .handle");
const bar = document.querySelector(".workspace-scroll .b-bar");
const w_scroll = document.querySelector(".workspace-scroll");

var h_startX = 0, h_currentX = 0, h_left = 0, pageLeft = 0;

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
      if (currentPosX - initialTouchPosX < 0) {
        if (pageID < pages_num) {
          pageID++;
        }
      } else {
        if (pageID > 0) {
          pageID--;
        }
      }
    }
    w.style.transform = 'translateX(' + -(pageID * window.innerWidth) + 'px)';
    h.style.left = ((pageID / pages_num) * w_scroll.offsetWidth) + "px";
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


function limitX() {
  if (h_left < 0) {h_left = 0;}
  if (h_left > w_scroll.offsetWidth) {h_left = w_scroll.offsetWidth;}
}

function handleMove(e) {
  e.preventDefault();
  requestAnimationFrame(() => {
    h_currentX = e.clientX;
    h_left = h_currentX - h_startX;
    limitX();
    pageLeft = ((h_left / w_scroll.offsetWidth) * pages_num) * 100;
    h.style.left = h_left + "px";
    w.style.transform = 'translateX(' + -pageLeft + 'vw)';
  });
}

function handleEnd(e) {
  e.preventDefault();
  h.style.height = h.style.width = (e.pointerType === "mouse") ? "" : "1em";
  h.style.transition = w.style.transition = "all 0.3s ease-out";
  
  requestAnimationFrame(() => {
    h_left = e.clientX - h_startX;
    limitX();
    var sPage = Math.round(((h_left / w_scroll.offsetWidth) * pages_num));
    var sPageX = sPage * 100;
    pageID = sPage;
    h.style.left = ((sPage / pages_num) * w_scroll.offsetWidth) + "px";
    w.style.transform = 'translateX(' + -sPageX + 'vw)';
  });
  document.removeEventListener(events.move, handleMove, true);
  document.removeEventListener(events.end, handleEnd, true);
  document.removeEventListener(events.cancel, handleEnd, true);
}

function handleDown(e) {
  e.preventDefault();
  h.style.height = h.style.width = "1.5em";
  h.style.transition = w.style.transition = "initial";
  h_startX = w_scroll.offsetLeft;
  requestAnimationFrame(() => {handleMove(e);});
  document.addEventListener(events.move, handleMove, true);
  document.addEventListener(events.end, handleEnd, true);
  document.addEventListener(events.cancel, handleEnd, true);
}

if (window.PointerEvent) {
  w.addEventListener('pointerdown', handleGestureStart, true);
  //h.addEventListener('pointerdown', handleDown, true);
  w_scroll.addEventListener('pointerdown', handleDown, true);
  events.move = "pointermove";
  events.end = "pointerup";
  events.cancel = "pointercancel";
} else {
  w.addEventListener('touchstart', handleGestureStart, true);
  //h.addEventListener('touchstart', handleDown, true);
  w_scroll.addEventListener('touchstart', handleDown, true);
  events.move = "touchmove";
  events.end = "touchend";
  events.cancel = "touchcancel";
  w.addEventListener('mousedown', handleGestureStart, true);
  w_scroll.addEventListener('mousedown', handleDown, true);
}