"use strict";

//functions for handling success message popup
const popupBg = document.querySelector(".screen-popup-back");
const successMark = document.querySelector(".popup-checkmark-container");

//Selectors
const userAlert = document.querySelector(".login-error-label");
const errMsg = document.querySelector("#errMsg");

//function for hiding error message
function hidingPopup() {
  userAlert.classList.add("hidden");
}

// Function for add-client submit
const form = document.getElementById("addClient-form");
form.addEventListener("submit", function (event) {
  event.preventDefault(); //prevent from auto submit
  const personName = document.getElementById("name").value;
  const address = document.getElementById("address").value;
  const contact = document.getElementById("contact").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const cnfPassword = document.getElementById("confirmPassword").value;

  //Checking for empty inputs
  if (personName === "") {
    errMsg.innerText = "Please Enter Name";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("name").focus();
    return;
  } else if (address === "") {
    errMsg.innerText = "Please Enter Address";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("address").focus();
    return;
  } else if (contact === "") {
    errMsg.innerText = "Please Enter Contact";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("contact").focus();
    return;
  } else if (email === "") {
    errMsg.innerText = "Please Enter Email";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("email").focus();
    return;
  } else if (password === "") {
    errMsg.innerText = "Please Enter Password";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("password").focus();
    return;
  } else if (cnfPassword === "") {
    errMsg.innerText = "Please Confirm Password";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("confirmPassword").focus();
    return;
  }

  const regexConfirmPass = new RegExp(cnfPassword);
  if (!regexConfirmPass.test(password)) {
    errMsg.innerText = "Confirm Password is not Matching";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("confirmPassword").focus();
    return;
  }

  //Checking for valid Phone Number
  if (contact != contact.match(/[0-9]{10}/)) {
    errMsg.innerText = "Enter a Valid Phone Number";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("contact").focus();
    return;
  }

  const result = fetch("/api/users/add-admin", {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
    },
    body: JSON.stringify({
      name: personName,
      phoneNo: contact,
      email: email,
      address: address,
      password: password,
      passwordConfirm: cnfPassword,
    }),
  })
    .then((res) => res.json()) //Parsing to json

    //Response handling function
    .then(function (res) {
      //If credentials are correct
      if (res.status === "success") {
        setTimeout(function () {
          popupBg.classList.remove("hidden");
          successMark.classList.remove("hidden"); // Removing the "hidden" class

          // Start the GIF animation (assuming it's an <img> element)
          const gifImage = successMark.querySelector("img");
          gifImage.src = gifImage.src; // This will reset the image and restart the animation
          setTimeout(() => (location.href = "/all-admins"), 4000);
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
