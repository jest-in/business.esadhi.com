"use strict";

//Selectors
const userAlert = document.querySelector(".login-error-label");
const errMsg = document.querySelector("#errMsg");

//function for hiding error message
function hidingPopup() {
  userAlert.classList.add("hidden");
}

// Function for login submit
const form = document.getElementById("form");
form.addEventListener("submit", function (event) {
  event.preventDefault(); //prevent from auto submit
  const userId = document.getElementById("email-id").value;
  const password = document.getElementById("password").value;
  console.log(userId, password);

  //Checking for empty password
  if (userId === "") {
    errMsg.innerText = "Please Enter your Email";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("email-id").focus();
    return;
  } else if (password === "") {
    errMsg.innerText = "Please Enter Password";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("password").focus();
    return;
  }

  const result = fetch("http://localhost:3000/api/login", {
    // credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
    },
    body: JSON.stringify({
      email: userId,
      password,
    }),
  })
    .then((res) => res.json()) //Parsing to json

    //Response handling function
    .then(function (res) {
      //If credentials are wrong
      if (res.status === "success") {
        if (res.role === 101) {
          location.href = "/dashboard";
        } else if (res.role === 102) {
          location.href = "/admin/dashboard";
        } else {
          errMsg.innerText = "Unauthorised Access";
          userAlert.classList.remove("hidden");
          setTimeout(hidingPopup, 5000);
          return;
        }
      } else {
        errMsg.innerText = res.message;
        userAlert.classList.remove("hidden");
        setTimeout(hidingPopup, 5000);
        return;
      }
    })
    .catch(function () {
      errMsg.innerText = "Check your internet connection";
      userAlert.classList.remove("hidden");
      setTimeout(hidingPopup, 5000);
      return;
    });
});

//Cursor auto select to email id
document.getElementById("email-id").focus();

document.addEventListener("keydown", function (e) {
  if (e.key === "ArrowDown") document.getElementById("password").focus();

  if (e.key === "ArrowUp") document.getElementById("email-id").focus();

  if (e.key === "Enter") registerUser();
});
