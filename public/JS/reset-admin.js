"use strict";

//Selectors
const userAlert = document.querySelector(".login-error-label");
const errMsg = document.querySelector("#errMsg");

//functions for handling success message popup
const popupBg = document.querySelector(".screen-popup-back");
const successMark = document.querySelector(".popup-checkmark-container");

//function for hiding error message
function hidingPopup() {
  userAlert.classList.add("hidden");
}

// Function for login submit
const form = document.getElementById("form");
form.addEventListener("submit", function (event) {
  event.preventDefault(); //prevent from auto submit
  const email = document.getElementById("email").value;
  const newPassword = document.getElementById("new-password").value;
  const cnfPassword = document.getElementById("cnf-password").value;

  //Checking for empty password
  if (email === "") {
    errMsg.innerText = "Please Enter Email";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("email").focus();
  } else if (newPassword === "") {
    errMsg.innerText = "Please Enter New Password";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("new-password").focus();
    return;
  } else if (cnfPassword === "") {
    errMsg.innerText = "Please Confirm Password";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("cnf-password").focus();
    return;
  }

  //checking for current and
  const regexConfirmPass = new RegExp(cnfPassword);
  if (!regexConfirmPass.test(newPassword)) {
    errMsg.innerText = "Confirm Password is not Matching";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("cnf-password").focus();
    return;
  }

  const result = fetch("/api/users/reset-admin-password", {
    credentials: "include",
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
    },
    body: JSON.stringify({
      email: email,
      password: newPassword,
      passwordConfirm: cnfPassword,
    }),
  })
    .then((res) => res.json()) //Parsing to json

    //Response handling function
    .then(function (res) {
      //If credentials are wrong
      if (res.status === "success") {
        setTimeout(function () {
          popupBg.classList.remove("hidden");
          successMark.classList.remove("hidden"); // Removing the "hidden" class

          // Start the GIF animation (assuming it's an <img> element)
          const gifImage = successMark.querySelector("img");
          gifImage.src = gifImage.src; // This will reset the image and restart the animation
          setTimeout(() => (location.href = "/dashboard"), 4000);
        }, 100);
      } else {
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
