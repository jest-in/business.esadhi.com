"use strict";

const transactionsContainer = document.getElementById("transactions");
const transactionCountElement = document.getElementById("transactionCount");

fetch("http://localhost:3000/api/transactions/view-added", {
  credentials: "include",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
  },
})
  .then((response) => response.json())
  .then((data) => {
    if (data.status === "success" && data.transactions) {
      // Update transaction count dynamically
      const transactionsCount = data.transactions.length;
      transactionCountElement.textContent = transactionsCount;

      // Generate HTML for each transaction data row
      const transactionsHTML = data.transactions
        .map(
          (transaction, index) => `
      <div class="approval-table-content-div" data-transaction-id="${
        transaction._id
      }">
        <div class="approve-table-content-hover">
          <div class="approval-slno-div">
            <h1>${index + 1}</h1>
          </div>
          <div class="approval-name-div">
            <h1>${transaction.name}</h1>
          </div>
          <div class="approval-contact-div">
            <h1>${transaction.phoneNo}</h1>
          </div>
          <div class="approval-admin-div">
            <h1>${transaction.admin}</h1>
          </div>
          <div class="approval-package-div">
            <h1>${transaction.category}</h1>
          </div>
        </div>
        <hr class="approval-hr">
      </div>
    `
        )
        .join("");

      transactionsContainer.innerHTML = transactionsHTML;
      const transactionRows = transactionsContainer.querySelectorAll(
        ".approval-table-content-div"
      );

      // Add click event listener to each transaction row
      transactionRows.forEach((row) => {
        row.addEventListener("click", handleTransactionClick);
      });
    } else {
      console.error("Invalid API response:", data);
    }
  })
  .catch((error) => {
    console.error("Error fetching data:", error);
  });

// Click event handler for transaction rows
function handleTransactionClick(event) {
  const transactionId = event.currentTarget.getAttribute("data-transaction-id");
  console.log(transactionId);
  if (transactionId) {
    window.location.href = `approve/${transactionId}`;
  }
}
