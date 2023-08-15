"use strict";

// Function for logout
const logoutBtn = document.getElementById("logout-icon-btn");
logoutBtn.addEventListener("click", function (event) {
  const result = fetch("http://localhost:3000/api/logout", {
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
