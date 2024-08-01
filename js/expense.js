//Budget input selectors
const budgetInputCard = document.querySelector(".set-budget-card");
const budgetInput = document.querySelector(".budget-input");
const budgetSubmit = document.querySelector(".budget-btn");

//Budget/Expense/Income display selectors
const movementCards = document.querySelectorAll(".movement-card");
const budgetDisplayLabel = document.querySelector(".budget-amount");
const expensesDisplayLabel = document.querySelector(".expense-amount");
const incomesDisplayLabel = document.querySelector(".income-amount");

//Transaction input selectors
const transactionType = document.querySelector(".transaction-type");
const transactionName = document.querySelector(".expense-name");
const transactionDate = document.querySelector(".expense-date");
const transactionAmount = document.querySelector(".expense-number");
const transactionSubmit = document.querySelector(".expense-submit");

//Transaction table selectors
const transactionTable = document.querySelector(".table-body");
const tableTransactions = document.querySelector(".table-transactions");
const tableEmptyLabel = document.querySelector(".empty-label");

//Sort buttons
const sortBtns = document.querySelectorAll(".sort-btn");
const sortTypeBtn = document.querySelector(".sort-type");
const sortDateBtn = document.querySelector(".sort-date");
const sortNameBtn = document.querySelector(".sort-name");
const sortAmountBtn = document.querySelector(".sort-amount");
let sortAscending = false;
let sortColumn = "";

//Set default date to today
transactionDate.valueAsDate = new Date();
transactionDate.max = new Date().toISOString().split("T")[0];

//Dynamic variables
let currentBudget = 0;
let currentExpenses = 0;
let currentIncomes = 0;
let currentTransactions = [
  {
    type: "budget",
    date: new Date(2011, 11, 30),
    name: "Initial budget.",
    amount: 123,
  },
  {
    type: "expense",
    date: new Date(2011, 11, 30),
    name: "23",
    amount: -23,
  },

  {
    type: "income",
    date: new Date(2011, 11, 30),
    name: "123",
    amount: 123,
  },

  {
    type: "expense",
    date: new Date(2011, 11, 30),
    name: "123",
    amount: -123,
  },
];
let totalTransactions = currentTransactions.length;

/* ///////////////////////// */
/* FUNCTIONS */
/* ///////////////////////// */

//Budget input function
const setBudget = function (amount) {
  //Alert the user if budget input is empty
  if (!amount) {
    alert("Please enter your budget!");
    return false;
  } else {
    budgetDisplayLabel.innerHTML = `${amount}lv.`;
    incomesDisplayLabel.innerHTML = `${amount}lv.`;

    //Remove budget input card
    budgetInputCard.remove();
    //Show budget amount card
    movementCards.forEach((c) => (c.style.display = "flex"));
    return true;
  }
};

//Input field reset
const resetField = function (...fields) {
  fields.forEach((f) => (f.value = ""));
};

//Validate transaction inputs
const validateTransactionInputs = function (t, d, n, a) {
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
  else return 1;
};

//Process transaction inputs (after validation)
const processTransactionInputs = function (type, dateInput, nameTrn, amount) {
  //Change to negative amount if type = expense
  if (type === "expense") amount = -amount;

  //Store transaction details in transactions list
  currentTransactions.push({
    type: type,
    date: new Date(dateInput),
    name: nameTrn,
    amount: amount,
  });

  //Update current budget value
  currentBudget = currentBudget + amount;
  //Update current budget label
  budgetDisplayLabel.innerHTML = `${currentBudget}lv.`;

  //Reset transaction date to today
  transactionDate.valueAsDate = new Date();
};

//Display transactions
const displayTransactions = function () {
  //Clear table
  transactionTable.innerHTML = "";

  //Display transaction row
  currentTransactions.forEach(function (trn) {
    let html = `<tr class="${trn.type}-row">
        <td class="t-type">${trn.type}</td>
        <td class="t-date">${trn.date.toISOString().split("T")[0]}</td>
        <td class="t-name">${trn.name}</td>
        <td class="t-number">${trn.amount}lv.</td>
      </tr>`;

    transactionTable.insertAdjacentHTML("afterbegin", html);
  });
};

//Display incomes and expenses
const transactionTypeSums = function () {
  currentExpenses = 0;
  currentIncomes = 0;
  currentTransactions.forEach((trn) =>
    trn.type == "expense"
      ? (currentExpenses += trn.amount)
      : (currentIncomes += trn.amount)
  );

  expensesDisplayLabel.innerHTML = `${currentExpenses}lv.`;
  incomesDisplayLabel.innerHTML = `${currentIncomes}lv.`;
};

//Sorts strings A - Z
const sortNameAlpha = function (col) {
  currentTransactions.sort((a, b) => {
    const nameA = a[col].toUpperCase(); // ignore upper and lowercase
    const nameB = b[col].toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      // A comes before B
      return -1;
    }
    if (nameA > nameB) {
      //B comes before A
      return 1;
    }
    return 0; // A = B
  });
};

//Sorts strings Z - A
const sortNameRev = function (col) {
  currentTransactions.sort((a, b) => {
    const nameA = a[col].toUpperCase(); // ignore upper and lowercase
    const nameB = b[col].toUpperCase(); // ignore upper and lowercase
    if (nameA > nameB) {
      return -1; // B comes before A
    }
    if (nameA < nameB) {
      // A comes before B
      return 1;
    }
    return 0; // A = B
  });
};

/* ///////////////////////// */
/* HANDLERS */
/* ///////////////////////// */

//Set budget
budgetSubmit.addEventListener("click", function () {
  let type = "budget";
  let date = new Date();
  let nameTrn = "Initial budget.";
  let amount = Number(budgetInput.value);

  if (setBudget(amount)) {
    processTransactionInputs(type, date, nameTrn, amount);
    displayTransactions();
  }
});

//Add transaction¸
transactionSubmit.addEventListener("click", function () {
  //Take input values
  let type = transactionType.value;
  let dateInput = transactionDate.value;
  let nameTrn = transactionName.value;
  let amount = Number(transactionAmount.value);

  //If validation is successful...
  if (validateTransactionInputs(type, dateInput, nameTrn, amount)) {
    processTransactionInputs(type, dateInput, nameTrn, amount); // process transaction
    displayTransactions(); // display transaction
    transactionTypeSums(); // update incomes and expenses
    resetField(transactionType, transactionName, transactionAmount); // reset input fields
  }
});

//Sort buttons
sortBtns.forEach((btn) =>
  btn.addEventListener("click", function (e) {
    sortColumn = e.target.getAttribute("value");

    if (sortColumn == "date") {
      sortAscending
        ? currentTransactions.sort(function (a, b) {
            return new Date(b[sortColumn] - a[sortColumn]);
          })
        : currentTransactions.sort(function (a, b) {
            return new Date(a[sortColumn] - b[sortColumn]);
          });
      sortAscending = !sortAscending;
    } else if (sortColumn == "amount") {
      sortAscending
        ? currentTransactions.sort((a, b) => a[sortColumn] - b[sortColumn])
        : currentTransactions.sort((b, a) => a[sortColumn] - b[sortColumn]);
      sortAscending = !sortAscending;
    } else {
      sortAscending ? sortNameAlpha(sortColumn) : sortNameRev(sortColumn);
      sortAscending = !sortAscending;
    }
    displayTransactions();
  })
);

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
