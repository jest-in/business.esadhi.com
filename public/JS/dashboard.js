'use strict';

const countPendingApprovals = document.getElementById("penApprovals");
const countPendingRewards = document.getElementById("penRewards");

fetch('http://localhost:3000/api/transactions/view-added?count=true', {
  credentials: "include",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
  },
})
.then(response => response.json())
.then(data => {
  if (data.status === "success") {
    countPendingApprovals.innerText = data.totalCount;
  } else {
    console.error('Invalid API response:', data);
  }
})
.catch(error => {
  console.error('Error fetching data:', error);
});

fetch('http://localhost:3000/api/transactions/reward-eleigibles?count=true', {
  credentials: "include",
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    Accept: "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    Connection: "keep-alive",
  },
})
.then(response => response.json())
.then(data => {
  if (data.status === "success") {
    countPendingRewards.innerText = data.totalCount;
  } else {
    console.error('Invalid API response:', data);
  }
})
.catch(error => {
  console.error('Error fetching data:', error);
});

