
// make page and neighbouring pages visible, while also removing them from the pageArr
for (const delPage of pageArr.splice(pageID - 1, 3)) {
  delPage.style.display = "block";
}

// make the remaining pages invisible so they aren't rendered
for (const page of pageArr) {
  page.style.display = "none";
}