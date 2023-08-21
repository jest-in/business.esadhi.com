// // Get the _id from the URL query parameter
// const urlParams = new URLSearchParams(window.location.search);
// const transactionId = urlParams.get('transaction_id');

// // Fetch the user details using the transactionId
// fetch(`/api/transactions/user-details`,
// {
//       credentials: "include",
//       method: "PATCH",
//       headers: {
//         "Content-Type": "application/json",
//         Accept: "*/*",
//         "Accept-Encoding": "gzip, deflate, br",
//         Connection: "keep-alive",
//       },
//       body: JSON.stringify({
//         _id:transactionId
//       }),
//     })
// .then(response => response.json())
// .then(userData => {
//   if (userData.status === "success") {
//     // Access user details using userData
//     console.log('User details:', userData);
//     // Update the UI with user details
//     // Example: document.getElementById("userName").textContent = userData.name;
//   } else {
//     console.error('Invalid API response:', userData);
//   }
// })
// .catch(error => {
//   console.error('Error fetching data:', error);
// });
