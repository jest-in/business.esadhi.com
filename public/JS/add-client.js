"use strict";
//Function for selecting direct admin
const responseSelect = document.getElementById("responseSelect");
const textInput = document.getElementById("parentIdInput");
const packageSelect = document.getElementById("packageSelect");
const packageSelectDiv = document.querySelector(".packageSelect-div");

responseSelect.addEventListener("change", function () {
  const selectedValue = responseSelect.value;
  console.log(selectedValue);
  if (selectedValue === "yes") {
    textInput.value = "admin";
    textInput.disabled = true;
    packageSelectDiv.classList.remove("hidden");
    packageSelect.required = true;
  } else {
    textInput.value = "";
    textInput.disabled = false;
    packageSelectDiv.classList.add("hidden");
    packageSelect.required = false;
  }
});

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
  const parentId = document.getElementById("parentIdInput").value;
  const category = document.getElementById("packageSelect").value;

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
  } else if (parentId === "") {
    errMsg.innerText = "Please Enter Parent ID";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("parentIdInput").focus();
    return;
  } else if (responseSelect === "") {
    errMsg.innerText = "Please Select Direct Admin or not";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("responseSelect").focus();
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

  const result = fetch("/api/transactions/add", {
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
      parentId: parentId,
      category: category,
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
          setTimeout(() => (location.href = "/admin/dashboard"), 4000);
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
