"use strict";

//Selectors
const userAlert = document.querySelector(".login-error-label");
const errMsg = document.querySelector("#errMsg");

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

//For handling approve button
const clientApproveButton = document.querySelector(
  ".client-individual-approve-btn"
);
const popupBg = document.querySelector(".screen-popup-back");
const popupDiv = document.querySelector(".screen-popup-div");
const successMark = document.querySelector(".popup-checkmark-container");

clientApproveButton.addEventListener("click", function () {
  popupBg.classList.remove("hidden");
  popupDiv.classList.remove("hidden");
});

//For handling popup cancel button
const popupCancelButton = document.querySelector(".popup-cancel-btn");

popupCancelButton.addEventListener("click", function () {
  popupBg.classList.add("hidden");
  popupDiv.classList.add("hidden");
});

//function for hiding error message
function hidingPopup() {
  userAlert.classList.add("hidden");
}

function hidingSuccessMark() {
  successMark.classList.add("hidden");
}

// Function for login submit
const form = document.getElementById("add-client-form");
form.addEventListener("submit", function (event) {
  event.preventDefault(); //prevent from auto submit
  const _id = document.getElementById("_id").value;
  const clientId = document.getElementById("client-id").value;
  const cnfClientId = document.getElementById("cnf-client-id").value;
  const cardNo = document.getElementById("client-card-no").value;

  //Checking for empty fields
  if (clientId === "") {
    errMsg.innerText = "Please Enter Client ID";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("client-id").focus();
    return;
  } else if (cnfClientId === "") {
    errMsg.innerText = "Please Confirm Client ID";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("cnf-client-id").focus();
    return;
  } else if (cardNo === "") {
    errMsg.innerText = "Please Enter Card No";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("client-card-no").focus();
    return;
  }

  //checking for client-id and confirm client-id
  if (clientId !== cnfClientId) {
    errMsg.innerText = "Client ID is not Matching";
    userAlert.classList.remove("hidden");
    setTimeout(hidingPopup, 5000);
    document.getElementById("cnf-client-id").focus();
    return;
  }

  const result = fetch("/api/transactions/approve", {
    credentials: "include",
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      "Accept-Encoding": "gzip, deflate, br",
      Connection: "keep-alive",
    },
    body: JSON.stringify({
      id: _id,
      userId: clientId,
      cardNo: cardNo,
    }),
  })
    .then((res) => res.json()) //Parsing to json

    //Response handling function
    .then(function (res) {
      //If credentials are Correct
      if (res.status === "success") {
        popupDiv.classList.add("hidden");
        setTimeout(function () {
          successMark.classList.remove("hidden"); // Removing the "hidden" class
          // Start the GIF animation (assuming it's an <img> element)
          const gifImage = successMark.querySelector("img");
          gifImage.src = gifImage.src; // This will reset the image and restart the animation
          setTimeout(() => (location.href = "/approvals"), 4000);
        }, 100);
      } else {
        console.log(res);
        errMsg.innerText = res.message;
        userAlert.classList.remove("hidden");
        setTimeout(hidingPopup, 3500);
      }
    })
    .catch(function () {
      errMsg.innerText = "Check your internet connection";
      userAlert.classList.remove("hidden");
      setTimeout(hidingPopup, 5000);
    });
});
