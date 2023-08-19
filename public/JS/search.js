"use strict";
//Selector
const search = document.getElementById("search-approvals");

//Event listener
search.addEventListener("keyup", function () {
  //Selecting all elements under the class name(search-approvals)
  const list = document.querySelectorAll(".approval-table-content-div");

  //Dynamic regex
  let regex = new RegExp(search.value.toLowerCase());

  //Iterating on multiple elements of same class name(approval-table-content-div)
  for (let i = 0; i < list.length; i++) {
    //selector for h1 tag
    let arrayOfH2Tag = list[i].querySelectorAll("h1");
    let searchFound = false;

    //Iterating on multiple h1 tags
    for (let j = 0; j < arrayOfH2Tag.length; j++) {
      if (regex.test(arrayOfH2Tag[j].innerText.toLowerCase())) {
        searchFound = true;
        break;
      }
    }
    //Removes the hidden class If search found And also if the search box contains null value
    if (searchFound || search.value === "") list[i].classList.remove("hidden");
    else list[i].classList.add("hidden");
  }
});
