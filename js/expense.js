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
let currentBudget = 0;
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
  // reset expenses and incomes
  currentExpenses = 0;
  currentIncomes = 0;

  // go through each transaction and tally up the expenses and incomes
  currentTransactions.forEach((trn) =>
    trn.type == "expense"
      ? (currentExpenses += trn.amount)
      : (currentIncomes += trn.amount)
  );

  // display expenses and incomes
  expensesDisplayLabel.innerHTML = `${currentExpenses}lv.`;
  incomesDisplayLabel.innerHTML = `${currentIncomes}lv.`;
};

//Change sort button style
const styleSortBtn = function (ascending) {
  if (ascending) {
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
/* Current task - pagination СТАРТ*/
/* ///////////////////////// */

const pageBtnsContainer = document.querySelector(".number-pages-container");
let pageNumBtns = document.querySelectorAll(".page-btn");
let activeBtnValue = "1";

let pageBtn1;
let pageBtn2;
let pageBtn3;
let pageBtn4;
let pageBtn5;
let pageBtn6;
let pageBtn7;

let numberOfTransactions = 0;
let numberOfPages = 1;
let state = "start";

function changeValue(el, val) {
  el.value = val;
  el.textContent = val;
}

function eventL(page) {
  page.addEventListener("click", function () {
    let pageIndex = page.getAttribute("index"); // current button index
    let pageValue = Number(page.value); // current button value

    if (!page.classList.contains("active-btn")) {
      document.querySelector(".active-btn").classList.remove("active-btn"); // remove active-btn class from previous button
      page.classList.add("active-btn"); // add active-btn class to current btn
    }

    function seeStart() {
      console.log("start");
      changeValue(pageBtn2, 2);
      changeValue(pageBtn3, 3);
      changeValue(pageBtn4, 4);
      changeValue(pageBtn5, 5);
      changeValue(pageBtn6, "...");
      state = "start";
    }

    function seeEnd() {
      changeValue(pageBtn2, "...");
      changeValue(pageBtn3, numberOfPages - 4);
      changeValue(pageBtn4, numberOfPages - 3);
      changeValue(pageBtn5, numberOfPages - 2);
      changeValue(pageBtn6, numberOfPages - 1);
      state = "end";
    }

    function seeThree(num1, num2, num3) {
      changeValue(pageBtn2, "...");
      changeValue(pageBtn3, num1);
      changeValue(pageBtn4, num2);
      changeValue(pageBtn5, num3);
      changeValue(pageBtn6, "...");
      document.querySelector(".active-btn").classList.remove("active-btn");
      pageBtn4.classList.add("active-btn");
      state = "three";
    }

    if (pageIndex === "1") {
      seeStart();
    } else if (pageIndex === "7") {
      seeEnd();
    }

    if (state == "start") {
      if (pageIndex == "5") {
        seeThree(pageValue - 1, pageValue, pageValue + 1);
      }
    } else if (state == "end") {
      if (pageIndex == "3") {
        seeThree(pageValue - 1, pageValue, pageValue + 1);
      }
    } else {
      if (pageIndex == "3") {
        if (pageValue < 5) {
          document.querySelector(".active-btn").classList.remove("active-btn");

          seeStart();
          document.querySelector(".page-btn4").classList.add("active-btn");
        } else {
          console.log("aaa");

          seeThree(pageValue - 1, pageValue, pageValue + 1);
        }
      } else if (pageIndex == "5") {
        if (pageValue > numberOfPages - 4) {
          document.querySelector(".active-btn").classList.remove("active-btn");

          seeEnd();
          document.querySelector(".page-btn4").classList.add("active-btn");
        } else {
          console.log("a");
          seeThree(pageValue - 1, pageValue, pageValue + 1);
        }
      }
    }
  });
}

//add listener to first page
eventL(document.querySelector(".page-btn"));

let addNumBtn = function (index) {
  pageBtnsContainer.insertAdjacentHTML(
    //have first page visible
    "beforeend",
    ` <button class="page-btn page-btn${index}" index="${index}" value="${index}">${index}</button>`
  );
};

function addPage() {
  numberOfTransactions = currentTransactions.length;

  if (numberOfPages < Math.ceil(numberOfTransactions / 5)) {
    numberOfPages += 1;
    if (numberOfPages < 8) {
      addNumBtn(numberOfPages);
      eventL(pageBtnsContainer.lastChild);
    } else {
      pageBtn2 = document.querySelector(".page-btn2");
      pageBtn3 = document.querySelector(".page-btn3");
      pageBtn4 = document.querySelector(".page-btn4");
      pageBtn5 = document.querySelector(".page-btn5");
      pageBtn6 = document.querySelector(".page-btn6");
      pageBtn7 = document.querySelector(".page-btn7");

      pageBtn7.value = numberOfPages;
      pageBtn7.textContent = numberOfPages;
      if (document.querySelector(".active-btn").value < 5) {
        console.log("active < 5");
        pageBtn6.value = "...";
        pageBtn6.textContent = "...";
      } else if (
        document.querySelector(".active-btn").value >
        numberOfPages - 5
      ) {
        console.log("active > 4");
        pageBtn2.value = "...";
        pageBtn2.textContent = "...";
      }
    }
  }
}

/* ///////////////////////// */
/* Current task - pagination ЕНД*/
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
    displayTransactions();
    displayBtns();
  }
});

//Add transaction¸
transactionSubmit.addEventListener("click", function () {
  //Take input values

  //TEST START
  for (let i = 0; i < 5; i++) {
    currentTransactions.push({
      type: "budget",
      date: new Date(2011, 11, 30),
      name: "Initial budget.",
      amount: 123,
    });
  }

  addPage();
  //TEST END

  let type = transactionType.value;
  let dateInput = transactionDate.value;
  let nameTrn = transactionName.value;
  nameTrn = nameTrn.charAt(0).toUpperCase() + nameTrn.slice(1);
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
sortBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    styleSortBtn(sortAscending); // styles the sort button
    sortBtns.forEach((btn) => btn.classList.remove("sort-focus")); // removes focus from all buttons
    sortColumn = e.target.getAttribute("value"); //gets the name of the column
    e.target.classList.add("sort-focus"); //sets focus on the clicked button

    if (sortColumn == "date") {
      // sort logic if sorting the dates
      sortAscending
        ? currentTransactions.sort(
            (a, b) => new Date(a[sortColumn] - b[sortColumn])
          )
        : currentTransactions.sort(
            (a, b) => new Date(b[sortColumn] - a[sortColumn])
          );
    } else {
      // sort logic if sorting everything else
      sortAscending
        ? currentTransactions.sort((a, b) =>
            a[sortColumn] < b[sortColumn] ? -1 : 1
          )
        : currentTransactions.sort((a, b) =>
            a[sortColumn] > b[sortColumn] ? -1 : 1
          );
    }

    sortAscending = !sortAscending; // change ascending to false

    displayTransactions(); //update transations
  });
});
