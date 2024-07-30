//Budget input selectors
const budgetInputCard = document.querySelector(".set-budget-card");
const budgetInput = document.querySelector(".budget-input");
const budgetSubmit = document.querySelector(".budget-btn");

//Budget display selectors
const budgetDisplayCard = document.querySelector(".budget-display-card");
const budgetDisplayLabel = document.querySelector(".budget-number");

//Transaction input selectors
const transactionType = document.querySelector(".transaction-type");
const transactionName = document.querySelector(".expense-name");
const transactionDate = document.querySelector(".expense-date");
const transactionAmount = document.querySelector(".expense-number");
const transactionSubmit = document.querySelector(".expense-submit");

//Transaction table selectors
const transactionTable = document.querySelector(".transaction-table");
const tableEmptyLabel = document.querySelector(".empty-label");

//Set default date to today
transactionDate.valueAsDate = new Date();

//Dynamic variables
let currentBudget;
let transactions = [];

/* ///////////////////////// */
/* FUNCTIONS */
/* ///////////////////////// */

//Budget input function
let setBudget = function () {
  //Take budget from input and convert it to a number
  let budgetInputVal = Number(budgetInput.value);
  //Alert the user if budget input is empty
  if (!budgetInputVal) {
    alert("Please enter your budget!");
  } else {
    //Set current budget to input value
    currentBudget = budgetInputVal;
    //Set budget display label
    budgetDisplayLabel.innerHTML = `${currentBudget}lv.`;
    //Remove budget input card
    budgetInputCard.remove();
    //Show budget amount card
    budgetDisplayCard.style.display = "flex";
  }
};

//Input field reset
let resetField = function (...fields) {
  fields.forEach((f) => (f.value = ""));
};

//Validate transaction inputs
let validate = function (t, d, n, a) {
  //checks if all entries are entered
  if (!t || !d || !n || !a) {
    alert("Please fill in all expense details!");
    return;
  }
  //checks if budget is entered
  else if (!currentBudget && !currentBudget === 0) {
    alert("Please define your budget!");
    return;
  }
  //checks if expense is bigger than budget
  else if (t === "expense" && a > currentBudget) {
    alert("Insufficient funds!");
    return;
  }
  //processes transaction
  else {
    return 1;
  }
};

//Process transaction inputs (after validation)
let processTransactionInputs = function (t, d, n, a) {
  //Change to negative amount if type = expense
  if (t === "expense") {
    a = -a;
  }

  //Store transaction details in transactions list
  transactions.push({
    type: t,
    date: d,
    name: n,
    amount: a,
  });

  //Update current budget value
  currentBudget = currentBudget + a;
  //Update current budget label
  budgetDisplayLabel.innerHTML = `${currentBudget}lv.`;
  //Reset input fields
  resetField(transactionType, transactionName, transactionAmount);
  //Reset transaction date to today
  transactionDate.valueAsDate = new Date();
};

//Display transactions
let displayTransactions = function () {
  //Display table labels
  transactionTable.innerHTML = `<tr class="transaction-table-headings">
            <th>Type</th>
            <th>Date</th>
            <th>Name</th>
            <th>Amount</th>
          </tr>`;

  //Display transaction row
  transactions.forEach((t) =>
    transactionTable.insertAdjacentHTML(
      "beforeend",
      `<tr class="${t.type}-row">
        <td class="t-type">${t.type}</td>
        <td class="t-date">${t.date}</td>
        <td class="t-name">${t.name}</td>
        <td class="t-number">${t.amount}lv.</td>
      </tr>`
    )
  );
};

/* ///////////////////////// */
/* HANDLERS */
/* ///////////////////////// */

//Set budget
budgetSubmit.addEventListener("click", setBudget);

//Add expense
transactionSubmit.addEventListener("click", function () {
  //Take input values
  let type = transactionType.value;
  let date = transactionDate.value;
  let nameT = transactionName.value;
  let amount = Number(transactionAmount.value);

  //If validation is successful, run process and display transactions
  if (validate(type, date, nameT, amount)) {
    processTransactionInputs(type, date, nameT, amount);
    displayTransactions();
  }
});

// //Remove expense
// transactionTable.addEventListener("click", function (e) {
//   if (e.target.classList.contains("remove-transaction")) {
//     let transaction = e.target.parentElement.parentElement;
//     let transactionAmount = Number(
//       transaction.querySelector(".t-number").getAttribute("lenumber")
//     );
//     console.log(transactionAmount);
//     console.log(typeof transactionAmount);

//     console.log(currentBudget);
//     currentBudget = currentBudget - transactionAmount;
//     budgetDisplayLabel.innerHTML = `${currentBudget}lv.`;

//     console.log(currentBudget);

//     transaction.remove();
//   }
// });
