import { loadData, saveData } from "./storage.js";
let transactions = loadData();
window.showSection = function(sectionId) {
document.querySelectorAll("main section")
.forEach(section => section.hidden = true);
document.getElementById(sectionId).hidden = false;
}
const form = document.getElementById("transactionForm");
form.addEventListener("submit", function(e){
e.preventDefault();
const txn = {
id: "txn_" + Date.now(),
description:
document.getElementById("description").value,
amount:
parseFloat(document.getElementById("amount").value),
category:
document.getElementById("category").value,
date:
document.getElementById("date").value,
createdAt:
new Date().toISOString(),
updatedAt:
new Date().toISOString()
};
transactions.push(txn);
saveData(transactions);
renderTable();
form.reset();
});
function renderTable(){
const table =
document.getElementById("recordsTable");
table.innerHTML = "";
transactions.forEach(txn => {
const row = document.createElement("tr");
row.innerHTML = `
<td>${txn.description}</td>
<td>${txn.amount}</td>
<td>${txn.category}</td>
<td>${txn.date}</td>
`;
table.appendChild(row);
});
}
renderTable();