JavaScript
// =========================================================
// SpendWise Personal Budget & Expense Tracker (JavaScript)
// =========================================================

// 1. Application Data (Variables & Initial Sample Array)
const DEFAULT_BUDGET = 2500.0;

const INITIAL_EXPENSES = [
  { id: 1, name: "Monthly Apartment Rent", amount: 950.0, category: "Rent", date: "2026-11-01" },
  { id: 2, name: "Fresh Produce & Groceries", amount: 112.4, category: "Food", date: "2026-11-04" },
  { id: 3, name: "Metro & Bus Pass", amount: 48.0, category: "Transport", date: "2026-11-06" },
  { id: 4, name: "Electricity & Fiber Internet", amount: 135.75, category: "Utilities", date: "2026-11-10" },
  { id: 5, name: "Cinema & Weekend Dinner", amount: 64.5, category: "Entertainment", date: "2026-11-15" },
];

const CATEGORIES = ["Food", "Transport", "Rent", "Entertainment", "Utilities", "Other"];

let monthlyBudget = loadBudget();
let expenses = loadExpenses();

// 2. DOM Element References
const displayBudgetEl = document.getElementById("display-budget");
const displaySpentEl = document.getElementById("display-spent");
const displayRemainingEl = document.getElementById("display-remaining");
const statusBannerEl = document.getElementById("budget-status-banner");

const expenseNameInput = document.getElementById("expense-name");
const expenseAmountInput = document.getElementById("expense-amount");
const expenseCategorySelect = document.getElementById("expense-category");
const expenseDateInput = document.getElementById("expense-date");
const formErrorEl = document.getElementById("form-error");

const addExpenseBtn = document.getElementById("add-expense-btn");
const setBudgetBtn = document.getElementById("set-budget-btn");
const resetDemoBtn = document.getElementById("reset-demo-btn");
const filterCategorySelect = document.getElementById("filter-category");
const expensesTbody = document.getElementById("expenses-tbody");

// 3. Persistence Helpers (localStorage)
function loadBudget() {
  const saved = localStorage.getItem("spendwise_budget");
  return saved !== null ? parseFloat(saved) : DEFAULT_BUDGET;
}

function saveBudget() {
  localStorage.setItem("spendwise_budget", monthlyBudget.toString());
}

function loadExpenses() {
  const saved = localStorage.getItem("spendwise_expenses");
  if (saved !== null) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return [...INITIAL_EXPENSES];
    }
  }
  return [...INITIAL_EXPENSES];
}

function saveExpenses() {
  localStorage.setItem("spendwise_expenses", JSON.stringify(expenses));
}

// 4. Reusable Calculation & Formatting Functions
function formatCurrency(value) {
  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function calculateTotalSpent(expenseList) {
  let total = 0;
  for (let i = 0; i < expenseList.length; i++) {
    total += expenseList[i].amount;
  }
  return total;
}

function calculateRemainingBalance(budget, totalSpent) {
  return budget - totalSpent;
}

function calculateCategoryBreakdown(expenseList) {
  const breakdown = {};
  for (let i = 0; i < CATEGORIES.length; i++) {
    breakdown[CATEGORIES[i]] = { total: 0, count: 0 };
  }

  for (let i = 0; i < expenseList.length; i++) {
    const item = expenseList[i];
    if (breakdown[item.category]) {
      breakdown[item.category].total += item.amount;
      breakdown[item.category].count += 1;
    } else {
      breakdown["Other"].total += item.amount;
      breakdown["Other"].count += 1;
    }
  }

  return breakdown;
}

// 5. Decision Making & Dynamic UI Rendering
function evaluateBudgetHealth(budget, spent, remaining) {
  statusBannerEl.classList.remove("status-healthy", "status-warning", "status-danger");

  if (budget <= 0) {
    statusBannerEl.classList.add("status-warning");
    statusBannerEl.textContent = "No monthly budget set yet. Click 'Set Monthly Budget' in the sidebar to begin.";
    return;
  }

  const ratio = spent / budget;

  if (remaining < 0) {
    statusBannerEl.classList.add("status-danger");
    statusBannerEl.textContent = `Over Budget Alert: You have exceeded your monthly budget by ${formatCurrency(
      Math.abs(remaining)
    )}.`;
  } else if (ratio >= 0.8) {
    statusBannerEl.classList.add("status-warning");
    statusBannerEl.textContent = `Heads Up: You have used ${(ratio * 100).toFixed(
      0
    )}% of your budget. ${formatCurrency(remaining)} remaining.`;
  } else {
    statusBannerEl.classList.add("status-healthy");
    statusBannerEl.textContent = `On Track: You have used ${(ratio * 100).toFixed(
      0
    )}% of your budget with ${formatCurrency(remaining)} left to spend.`;
  }
}

function renderCategoryCards() {
  const breakdown = calculateCategoryBreakdown(expenses);

  for (let i = 0; i < CATEGORIES.length; i++) {
    const cat = CATEGORIES[i];
    const totalEl = document.getElementById(`total-${cat}`);
    const countEl = document.getElementById(`count-${cat}`);

    if (totalEl && countEl) {
      totalEl.textContent = formatCurrency(breakdown[cat].total);
      const count = breakdown[cat].count;
      countEl.textContent = count === 1 ? "1 item" : `${count} items`;
    }
  }
}

function renderExpensesTable() {
  const selectedFilter = filterCategorySelect.value;
  expensesTbody.innerHTML = "";

  const filteredExpenses = [];
  for (let i = 0; i < expenses.length; i++) {
    if (selectedFilter === "All" || expenses[i].category === selectedFilter) {
      filteredExpenses.push(expenses[i]);
    }
  }

  if (filteredExpenses.length === 0) {
    const emptyRow = document.createElement("tr");
    emptyRow.innerHTML = `<td colspan="5">No expenses found for this category.</td>`;
    expensesTbody.appendChild(emptyRow);
    return;
  }

  for (let i = 0; i < filteredExpenses.length; i++) {
    const expense = filteredExpenses[i];
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${escapeHTML(expense.name)}</td>
      <td><strong>${formatCurrency(expense.amount)}</strong></td>
      <td>${escapeHTML(expense.category)}</td>
      <td>${escapeHTML(expense.date)}</td>
      <td>
        <button type="button" class="btn-delete" data-id="${expense.id}">Delete</button>
      </td>
    `;

    expensesTbody.appendChild(row);
  }
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function updateDashboard() {
  const totalSpent = calculateTotalSpent(expenses);
  const remaining = calculateRemainingBalance(monthlyBudget, totalSpent);

  displayBudgetEl.textContent = formatCurrency(monthlyBudget);
  displaySpentEl.textContent = formatCurrency(totalSpent);
  displayRemainingEl.textContent = formatCurrency(remaining);

  evaluateBudgetHealth(monthlyBudget, totalSpent, remaining);
  renderCategoryCards();
  renderExpensesTable();

  // Clear, labeled console output for debugging & verification
  console.log("=== SpendWise Budget Summary ===");
  console.log("Monthly Budget:", formatCurrency(monthlyBudget));
  console.log("Total Spent:   ", formatCurrency(totalSpent));
  console.log("Remaining:     ", formatCurrency(remaining));
  console.log("Total Records: ", expenses.length);
}

// 6. Event Handlers & User Interactions
function handleAddExpense() {
  const name = expenseNameInput.value.trim();
  const amount = parseFloat(expenseAmountInput.value);
  const category = expenseCategorySelect.value;
  const date = expenseDateInput.value;

  if (!name || isNaN(amount) || amount <= 0 || !date) {
    formErrorEl.textContent = "Please enter a valid expense name, positive amount, and date.";
    formErrorEl.hidden = false;
    return;
  }

  formErrorEl.hidden = true;

  const newExpense = {
    id: Date.now(),
    name: name,
    amount: amount,
    category: category,
    date: date,
  };

  expenses.unshift(newExpense);
  saveExpenses();
  updateDashboard();

  // Reset text/number inputs while keeping today's date
  expenseNameInput.value = "";
  expenseAmountInput.value = "";
  expenseNameInput.focus();
}

function handleSetBudget() {
  const userInput = prompt(
    "Enter your total monthly budget amount ($):",
    monthlyBudget.toString()
  );

  if (userInput === null) return; // User cancelled

  const parsedBudget = parseFloat(userInput);
  if (isNaN(parsedBudget) || parsedBudget < 0) {
    alert("Please enter a valid positive number for your monthly budget.");
    return;
  }

  monthlyBudget = parsedBudget;
  saveBudget();
  updateDashboard();
}

function handleTableClick(event) {
  if (event.target.classList.contains("btn-delete")) {
    const idToDelete = Number(event.target.getAttribute("data-id"));
    const updatedList = [];

    for (let i = 0; i < expenses.length; i++) {
      if (expenses[i].id !== idToDelete) {
        updatedList.push(expenses[i]);
      }
    }

    expenses = updatedList;
    saveExpenses();
    updateDashboard();
  }
}

function handleResetDemo() {
  monthlyBudget = DEFAULT_BUDGET;
  expenses = [...INITIAL_EXPENSES];
  saveBudget();
  saveExpenses();
  filterCategorySelect.value = "All";
  updateDashboard();
}

// Set default date input to today's date
function setDefaultDate() {
  const today = new Date().toISOString().split("T")[0];
  expenseDateInput.value = today;
}

// Wire up Event Listeners
addExpenseBtn.addEventListener("click", handleAddExpense);
setBudgetBtn.addEventListener("click", handleSetBudget);
resetDemoBtn.addEventListener("click", handleResetDemo);
filterCategorySelect.addEventListener("change", renderExpensesTable);
expensesTbody.addEventListener("click", handleTableClick);

// Clicking a category card filters the table to that category
document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("click", () => {
    const cat = card.getAttribute("data-category");
    filterCategorySelect.value = filterCategorySelect.value === cat ? "All" : cat;
    renderExpensesTable();
  });
});

// Initialize Application on Load
setDefaultDate();
updateDashboard();