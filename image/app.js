var imageID = decodeURI(window.location.href.split("?")[1].split("i=")[1].split("&")[0]);
var page, pageID = 0;
var image = document.querySelector(".image");
if (navigator.connection) {
  if (navigator.connection.effectiveType !== "4g" || navigator.connection.saveData) {
    image.src = "/gallery/thumbs/" + imageID;
  } else {
    image.src = "/gallery/" + imageID;
  }
} else {
  image.src = "/gallery/" + imageID;
}
fetch("/search/data.json")
.then(response => response.json())
.then(data => {
  for (let d of data) {
    for (let [i, p] of d.pages.entries()) {
      if (p.file === imageID) {
        page = d; pageID = i;
        document.querySelector(".footer .title").innerHTML = page.name;
        document.querySelector(".description").innerHTML = (p.description === "") ? page.pages[0].description : p.description;
      }
    }
  }

  var button = document.querySelector(".info-button");
  var desc = document.querySelector(".description");
  var h = desc.clientHeight + 1;
  var c = document.querySelector(".description-container");
  desc.style.marginTop = "-" + h + "px";

  button.addEventListener("click", (e) => {
    c.style.transform = "";
    if (desc.getAttribute("open") === "true") {
      desc.style.marginTop = "-" + h + "px";
      desc.setAttribute("open",  "false");
    } else {
      desc.style.marginTop = "0px";
      desc.setAttribute("open",  "true");
    };
  });
  button.onmouseover = () => {if (desc.getAttribute("open") === "false") {c.style.transform = "translateY(10px)";}};
  button.onmouseleave = () => {c.style.transform = "";};
  window.onclick = (e) => {
    if (!desc.contains(e.target) && !button.contains(e.target)) {
      desc.style.marginTop = "-" + h + "px";
      desc.setAttribute("open",  "false");
    }
  };

  window.addEventListener("resize", () => {
    h = desc.clientHeight + 1;
    if (desc.getAttribute("open") === "false") {
      desc.style.marginTop = "-" + h + "px";
    } else {
      desc.style.marginTop = "0px";
    }
  });
})
.catch((e) => {console.log("Error: " + e);});

function p_nav(x) {
  if (x === 0) {
    image.style.transform = "";
  } else {
    image.style.transform = "translate(calc(" + (-x * 100) + "vw + -50%), -50%)";
    setTimeout(() => {
      pageID += x;
      window.location.href = "/image/?i=" + page.pages[pageID].file;
    }, 300);
  }
}

function bump(x) {
  image.style.transform = "translate(calc(" + (-x * 30) + "vw + -50%), -50%)";
  setTimeout(() => {
    image.style.transform = "";
  }, 150);
}

window.onkeydown = e => {
  if (page && page.pages.length > 1) {
    if (e.code === "ArrowLeft") {
      if (pageID > 0) {p_nav(-1);} else {bump(-1);}
    }
    if (e.code === "ArrowRight") {
      if (pageID < page.pages.length - 1) {p_nav(1);} else {bump(1);}
    }
  }
};

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
  image.style.transform = 'translate(calc(' + newXTransform + 'px + -50%), -50%)';
}

function handleGestureMove(e) {
  e.preventDefault();
  currentPosX = getGesturePointFromEvent(e);
  requestAnimationFrame(onAnimFrame);
}

function handleGestureEnd(e) {
  e.preventDefault();
  image.style.transition = "transform 0.3s ease-out";

  requestAnimationFrame(() => {
    var x = 0;
    if (Math.abs(currentPosX - initialTouchPosX) > window.innerWidth / 3) {
      if (currentPosX - initialTouchPosX > 0) {
        if (pageID > 0) {x = -1;}
      } else {
        if (pageID < page.pages.length - 1) {x = 1;}
      }
    }
    p_nav(x)
  });

  document.removeEventListener(events.move, handleGestureMove, true);
  document.removeEventListener(events.end, handleGestureEnd, true);
  document.removeEventListener(events.cancel, handleGestureEnd, true);
}

function handleGestureStart(e) {
  var text = [].reduce.call(e.target.childNodes, (a, b) => {return a + (b.nodeType === 3 ? b.textContent : '');}, '').trim();
  if (text === "" || e.pointerType !== "mouse") {
    e.preventDefault();
    image.style.transition = "initial";
    currentPosX = initialTouchPosX = getGesturePointFromEvent(e);
    document.addEventListener(events.move, handleGestureMove, true);
    document.addEventListener(events.end, handleGestureEnd, true);
    document.addEventListener(events.cancel, handleGestureEnd, true);
  }
}

if (window.PointerEvent) {
  document.addEventListener('pointerdown', this.handleGestureStart, true);
  events.move = "pointermove";
  events.end = "pointerup";
  events.cancel = "pointercancel";
} else {
  document.addEventListener('touchstart', this.handleGestureStart, true);
  events.move = "touchmove";
  events.end = "touchend";
  events.cancel = "touchcancel";
  document.addEventListener('mousedown', this.handleGestureStart, true);
}