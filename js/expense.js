let currentBudget;

let budgetCard = document.querySelector(".set-budget-card");
let budget = document.querySelector(".budget-input");
let submit = document.querySelector(".budget-btn");

let budgetDisplay = document.querySelector(".budget-display-card");
let budgetNumber = document.querySelector(".budget-number");

let transactionCard = document.querySelector(".transaction-details");
let transactionType = document.querySelector(".transaction-type");
let transctionName = document.querySelector(".expense-name");
let transactionDate = document.querySelector(".expense-date");
let transactionNumber = document.querySelector(".expense-number");
let transactionSubmit = document.querySelector(".expense-submit");

let table = document.querySelector(".table");
let emptyLabel = document.querySelector(".empty-label");

/* ///////////////////////// */
/* FUNCTIONS */
/* ///////////////////////// */
let resetField = function (...fields) {
  fields.forEach((f) => (f.value = ""));
};

let addTransaction = function (type, date, nameT, number) {
  budgetNumber.innerHTML = `${currentBudget}lv.`;
  emptyLabel.style.display = "none";
  table.insertAdjacentHTML(
    "beforeend",
    `<tr class="${type}">
             <td class="e-date">${type}</td>
        <td class="e-date">${date}</td>
        <td class="e-name">${nameT}</td>
        <td class="e-date">${number}lv.</td>
        <td class='e-remove'>
            <ion-icon
                class="btn remove-transaction"
                name="close-circle-outline"
            >
            </ion-icon>
        </td>
      </tr>`
  );
  resetField(transactionDate, transctionName, transactionNumber);
};

/* ///////////////////////// */
/* HANDLERS */
/* ///////////////////////// */

//Set budget
submit.addEventListener("click", function () {
  if (!budget.value) {
    alert("Please enter your budget!");
  } else {
    currentBudget = Number(budget.value);
    budgetNumber.innerHTML = `${currentBudget}lv.`;
    budgetCard.style.display = "none";
    budgetDisplay.style.display = "flex";
    resetField(budget);
  }
});

//Add expense
transactionSubmit.addEventListener("click", function () {
  let type = transactionType.value;
  let date = transactionDate.value;
  let nameT = transctionName.value;
  let number = Number(transactionNumber.value);

  if (!type || !date || !nameT || !number) {
    alert("Please fill in all expense details!");
  } else if (!currentBudget) {
    alert("Please define your budget!");
  } else if (type === "expense") {
    if (number > currentBudget) {
      alert("Insufficient funds!");
    } else {
      currentBudget = currentBudget - number;
      addTransaction(type, date, nameT, number);
    }
  } else {
    console.log(currentBudget);

    currentBudget = currentBudget + number;
    console.log(currentBudget);

    addTransaction(type, date, nameT, number);
  }
});
//Remove expense
table.addEventListener("click", function (e) {
  if (e.target.classList.contains("remove-transaction")) {
    let transaction = e.target.parentElement.parentElement;
    console.log(transaction.closest());
    if (transaction.closestChild.classList.contains("expense")) {
      console.log("expense");
    } else {
      console.log("fund");
    }
    transaction.remove();
  }
});
