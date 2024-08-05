//Page styles
const pageStyles = document.documentElement.style;

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
let currentBalance = 0;
let currentExpenses = 0;
let currentIncomes = 0;
let currentTransactions = [];
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
    // alert("Please fill in all expense details!");
    return;
  }
  //checks if budget is entered
  else if (!currentBalance && !currentBalance === 0) {
    alert("Please define your budget!");
    return;
  }
  //checks if expense is bigger than budget
  else if (t === "expense" && a > currentBalance) {
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
  currentBalance = currentBalance + amount;
  //Update current budget label
  budgetDisplayLabel.innerHTML = `${currentBalance}lv.`;

  //Reset transaction date to today
  transactionDate.valueAsDate = new Date();
};

//Display incomes and expenses
const transactionTypeSums = function () {
  // reset expenses and incomes
  currentExpenses = 0;
  currentIncomes = 0;
  currentBalance = 0;

  // go through each transaction and tally up the expenses and incomes
  currentTransactions.forEach((trn) =>
    trn.type == "expense"
      ? (currentExpenses += trn.amount)
      : (currentIncomes += trn.amount)
  );

  currentBalance = currentIncomes + currentExpenses;

  // display expenses and incomes
  expensesDisplayLabel.innerHTML = `${currentExpenses}lv.`;
  incomesDisplayLabel.innerHTML = `${currentIncomes}lv.`;
  budgetDisplayLabel.innerHTML = `${currentBalance}`;
  //ADD CURRENT BUDGET ( INCOMES - EXPENSES)
};

//Change sort button style
const styleSortBtn = function (ascending) {
  if (!ascending) {
    pageStyles.setProperty("--up-arrow-color", "#00000049");
    pageStyles.setProperty(
      "--up-arrow-shadow",
      "0px 0px 0px rgba(255, 255, 255, 0"
    );
    pageStyles.setProperty("--down-arrow-color", "#ffffff");
    pageStyles.setProperty("--down-arrow-shadow", "0px 0px 10px red");
  } else {
    pageStyles.setProperty("--up-arrow-color", "#ffffff");
    pageStyles.setProperty("--up-arrow-shadow", "0px 0px 10px green");
    pageStyles.setProperty("--down-arrow-color", "#00000049");
    pageStyles.setProperty(
      "--down-arrow-shadow",
      "0px 0px 0px rgba(255, 255, 255, 0)"
    );
  }
};

/* ///////////////////////// */
/* PAGINATION START
/* ///////////////////////// */

const pageBtnsContainer = document.querySelector(".number-pages-container");
let numberOfTransactions = 0;
let numberOfPages = 1;
let startTrn = 1;
let endTrn = 5;
let pageIndex = 1; // current button index
let pageValue = 1;

//Display transactions
function displayTransactions(pageNumber) {
  startTrn = (pageNumber - 1) * 5 + 1;

  endTrn = startTrn + 4;
  if (endTrn > currentTransactions.length) {
    endTrn = currentTransactions.length;
  }

  transactionTable.innerHTML = "";

  for (let i = startTrn - 1; i < endTrn; i++) {
    console.log(`i ${i}`);
    trn = currentTransactions[i];
    let html = `<tr class="${trn.type}-row">
        <td class="t-type">${trn.type}</td>
        <td class="t-date">${trn.date.toISOString().split("T")[0]}</td>
        <td class="t-name">${trn.name}</td>
        <td class="t-number">${trn.amount}lv.</td>
      </tr>`;

    transactionTable.insertAdjacentHTML("beforeend", html);
  }

  document.querySelector(
    ".pagination-lbl"
  ).textContent = `Currently  ${startTrn} to ${endTrn} of ${currentTransactions.length} `;
}

//Keeps track how the buttons should be displayed
let pageBtnPosition = "start";

// Array that will store newly created page buttons for easier accessability
let pageBtns = [];

//Adds the first page and makes it active.
addPageBtn();
pageBtns[0].classList.add("active-btn");

// Add page button on page increase till 8 buttons
function addPageBtn() {
  //Create page button along with its info, make it visible on the page and store the element in pages array
  const page = document.createElement("button");
  page.classList.add("page-btn", `page-btn${numberOfPages}`);
  page.setAttribute("index", numberOfPages);
  page.setAttribute("value", numberOfPages);
  page.textContent = `${numberOfPages}`;
  pageBtnsContainer.appendChild(page);
  pageBtns.push(page);

  //Event listener to make the button active on click and remove active label from other button
  page.addEventListener("click", function () {
    if (!page.classList.contains("active-btn")) {
      document.querySelector(".active-btn").classList.remove("active-btn"); // remove active-btn class from previous button
      page.classList.add("active-btn"); // add active-btn class to current btn
      pageValue = Number(page.textContent);
      displayTransactions(pageValue);
    }
  });
}

//Check if button position should be at start, end or middle(three)
function checkPageBtnPosition(pageIndex, pageValue) {
  if (pageIndex === "1") {
    pageBtnPosition = "start";
  } else if (pageIndex === "7") {
    pageBtnPosition = "end";
  } else if (pageBtnPosition == "start" && pageIndex == "5") {
    pageBtnPosition = "three";
  } else if (pageBtnPosition == "end" && pageIndex == "3") {
    pageBtnPosition = "three";
  } else if (pageBtnPosition == "three" && pageValue < 5) {
    pageBtnPosition = "start";
  } else if (pageBtnPosition == "three" && pageValue > numberOfPages - 4) {
    pageBtnPosition = "end";
  }
  return pageBtnPosition;
}

//Update the buttons depending on the button position
function updateBtn(pageValue) {
  if (pageBtnPosition == "start") {
    pageBtns[1].textContent = 2;
    pageBtns[2].textContent = 3;
    pageBtns[3].textContent = 4;
    pageBtns[4].textContent = 5;
    pageBtns[5].textContent = "...";
  } else if (pageBtnPosition == "end") {
    pageBtns[1].textContent = "...";
    pageBtns[2].textContent = numberOfPages - 4;
    pageBtns[3].textContent = numberOfPages - 3;
    pageBtns[4].textContent = numberOfPages - 2;
    pageBtns[5].textContent = numberOfPages - 1;
  } else {
    pageBtns[1].textContent = "...";
    pageBtns[2].textContent = pageValue - 1;
    pageBtns[3].textContent = pageValue;
    pageBtns[4].textContent = pageValue + 1;
    pageBtns[5].textContent = "...";
    document.querySelector(".active-btn").classList.remove("active-btn");
    pageBtns[3].classList.add("active-btn");
  }
}

//Add event listeners to page buttons once 8th button is created that will handle the button logic from then on
function clickLogicAt8(page) {
  //Sets last btn value
  pageBtns[6].textContent = numberOfPages;

  page.addEventListener("click", function () {
    pageIndex = page.getAttribute("index"); // current button index
    pageValue = Number(page.textContent); // current button value

    //Updates currently active btn
    document.querySelector(".active-btn").classList.remove("active-btn");
    page.classList.add("active-btn");
    console.log(`this is index ${pageIndex}`);
    console.log(`this is index ${pageValue}`);

    checkPageBtnPosition(pageIndex, pageValue);
    updateBtn(pageValue);
    displayTransactions(pageValue);
  });
}

//Update the buttons when creating the 8th button depending on active button positon
function updateAt8() {
  let activeBtn = document.querySelector(".active-btn");

  //Update current pageBtnPosition
  if (activeBtn.value < 5) {
    pageBtnPosition = "start";
  } else if (activeBtn.value > numberOfPages - 5) {
    pageBtnPosition = "end";
  } else {
    pageBtnPosition = "three";
  }

  updateBtn(pageBtnPosition);
}

//Check if the page number has increased and if any action is needed to be taken
function pageIncreaseCheck() {
  if (numberOfPages < Math.ceil(numberOfTransactions / 5)) {
    numberOfPages += 1;
    if (numberOfPages < 9) {
      if (numberOfPages < 8) {
        addPageBtn();
      } else {
        updateAt8();
        pageBtns.forEach((page) => clickLogicAt8(page));
      }
    } else {
      pageBtns[pageBtns.length - 1].textContent = `${numberOfPages}`;
    }
  }
}

/* ///////////////////////// */
/* PAGINATION END
/* ///////////////////////// */

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
    displayTransactions(pageValue);
  }
});

//Add transaction¸
transactionSubmit.addEventListener("click", function () {
  //Take input values

  currentTransactions.push({
    type: "budget",
    date: new Date(2011, 11, 30),
    name: "Initial budget.",
    amount: 123,
  });

  let type = transactionType.value;
  let dateInput = transactionDate.value;
  let nameTrn = transactionName.value;
  let amount = Number(transactionAmount.value);
  nameTrn = nameTrn.charAt(0).toUpperCase() + nameTrn.slice(1);
  numberOfTransactions = currentTransactions.length;

  //If validation is successful...
  if (validateTransactionInputs(type, dateInput, nameTrn, amount)) {
    processTransactionInputs(type, dateInput, nameTrn, amount); // process transaction
    displayTransactions(pageValue);
    transactionTypeSums(); // update incomes and expenses
    resetField(transactionType, transactionName, transactionAmount); // reset input fields
  }

  //If number of pages changes...
  pageIncreaseCheck();
  displayTransactions(pageValue);
});

//Sort buttons
sortBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    styleSortBtn(sortAscending); // styles the sort button
    sortBtns.forEach((btn) => btn.classList.remove("sort-focus")); // removes focus from all buttons
    sortColumn = e.target.getAttribute("value"); //gets the name of the column
    e.target.classList.add("sort-focus"); //sets focus on the clicked button

    function sortDate() {
      sortAscending
        ? currentTransactions.sort(
            (a, b) => new Date(a[sortColumn] - b[sortColumn])
          )
        : currentTransactions.sort(
            (a, b) => new Date(b[sortColumn] - a[sortColumn])
          );
    }

    function sortRest() {
      sortAscending
        ? currentTransactions.sort((a, b) =>
            a[sortColumn] < b[sortColumn] ? -1 : 1
          )
        : currentTransactions.sort((a, b) =>
            a[sortColumn] > b[sortColumn] ? -1 : 1
          );
    }

    sortColumn == "date" ? sortDate() : sortRest();

    sortAscending = !sortAscending; // change ascending to false
    displayTransactions(pageValue);
    console.log(currentTransactions);
  });
});
