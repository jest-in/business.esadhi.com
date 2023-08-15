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
  const password = document.getElementById("password").value;
  const newPassword = document.getElementById("new-password").value;
  const cnfPassword = document.getElementById("cnf-password").value;
  console.log(newPassword, cnfPassword);

  //Checking for empty password
  if (password === "") {
    errMsg.innerText = "Please Enter Password";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("password").focus();
  } else if (newPassword === "") {
    errMsg.innerText = "Please Enter New Password";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("new-password").focus();
  } else if (cnfPassword === "") {
    errMsg.innerText = "Please Confirm Password";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("cnf-password").focus();
  }

  //checking for current and
  const regexConfirmPass = new RegExp(cnfPassword);
  if (!regexConfirmPass.test(newPassword)) {
    errMsg.innerText = "Confirm Password is wrong";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("cnf-password").focus();
  }

  const result = fetch("http://localhost:3000/api/reset-password", {
    credentials: "include",
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
    },
    body: JSON.stringify({
      currentPassword: password,
      password: newPassword,
      passwordConfirm: cnfPassword,
    }),
  })
    .then((res) => res.json()) //Parsing to json

    //Response handling function
    .then(function (res) {
      //If credentials are wrong
      if (res.status !== "success") {
        errMsg.innerText = res.message;
        userAlert.classList.remove("hidden");
        setTimeout(hidingPopup, 5000);
      }
    })
    .catch(function () {
      errMsg.innerText = "Check your internet connection";
      userAlert.classList.remove("hidden");
      setTimeout(hidingPopup, 5000);
    });
});
