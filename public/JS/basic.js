"use strict";

// Function for logout
const logoutBtn = document.getElementById("logout-icon-btn");
logoutBtn.addEventListener("click", function (event) {
  const result = fetch("/api/logout", {
    credentials: "include",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
    },
  })
    .then((res) => res.json()) //Parsing to json

    //Response handling function
    .then(function (res) {
      //If credentials are success
      if (res.status === "success") {
        location.href = "/";
      }
    })
    .catch(function () {
      return;
    });
});

//For handling menu button
const menuButton = document.querySelector(".menuOpenBtn");
const menuCloseButton = document.querySelector(".menuCloseBtn");
const navBar = document.querySelector(".dash-nav-inner-container");

menuButton.addEventListener("click", function () {
  menuButton.classList.add("hidden");
  menuCloseButton.classList.remove("hidden");
  navBar.style.display = "flex";
});

menuCloseButton.addEventListener("click", function () {
  menuCloseButton.classList.add("hidden");
  menuButton.classList.remove("hidden");
  navBar.style.display = "none";
});
