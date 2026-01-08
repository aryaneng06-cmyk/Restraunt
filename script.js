/* 
    WHAT IS THIS FILE?
    This is the JavaScript file - the "brain" of our application.
    JavaScript makes everything interactive - buttons work, calculations happen,
    data gets saved, and the page updates dynamically.
    
    JAVASCRIPT BASICS:
    - Variables: Store data (like a box with a label)
    - Functions: Reusable blocks of code (like a recipe)
    - Event Listeners: "When user clicks button, do this"
    - LocalStorage: Browser's storage system (like a small database)
    
    HOW IT WORKS:
    1. User does something (clicks button, types in field)
    2. JavaScript "listens" for that action
    3. JavaScript processes the data
    4. JavaScript updates what the user sees
    5. JavaScript saves data to LocalStorage
*/

/* 
    ========================================
    PART 1: LOCALSTORAGE SETUP
    ========================================
    
    WHAT IS LOCALSTORAGE?
    LocalStorage is like a small database inside your web browser.
    - Data persists even after you close the browser
    - Data is stored on YOUR computer (not on a server)
    - Each website has its own LocalStorage space
    - Data is stored as text (we convert to/from JSON format)
    
    HOW IT WORKS:
    - localStorage.setItem('key', 'value') - saves data
    - localStorage.getItem('key') - retrieves data
    - localStorage.removeItem('key') - deletes data
    - JSON.stringify() - converts JavaScript object to text
    - JSON.parse() - converts text back to JavaScript object
*/

// This is our data structure - like a blueprint of what data we store
// We'll use this to initialize empty data when user first visits
const defaultDataStructure = {
    // Income data
    income: {
        salary: 0,      // Monthly salary
        other: 0        // Other income sources
    },
    // Array of expenses (list of expense objects)
    expenses: [],
    // Array of goals (list of goal objects)
    goals: []
};

// Variable to hold our current data
// This will be loaded from LocalStorage or initialized as default
let appData = {};

/* 
    FUNCTION: loadDataFromLocalStorage
    This function reads data from LocalStorage and loads it into our app.
    If no data exists, it creates default empty data.
*/
function loadDataFromLocalStorage() {
    // Try to get data from LocalStorage
    // 'financeAppData' is the key we use to store our data
    const savedData = localStorage.getItem('financeAppData');
    
    // Check if data exists
    if (savedData) {
        // Data exists - convert it from text (JSON) back to JavaScript object
        try {
            appData = JSON.parse(savedData);
            
            // Make sure all required properties exist (in case data structure changed)
            if (!appData.income) appData.income = { salary: 0, other: 0 };
            if (!appData.expenses) appData.expenses = [];
            if (!appData.goals) appData.goals = [];
        } catch (error) {
            // If there's an error parsing, use default data
            console.error('Error loading data:', error);
            appData = JSON.parse(JSON.stringify(defaultDataStructure));
        }
    } else {
        // No data exists - use default empty structure
        appData = JSON.parse(JSON.stringify(defaultDataStructure));
    }
}

/* 
    FUNCTION: saveDataToLocalStorage
    This function saves our current data to LocalStorage.
    We call this every time data changes.
*/
function saveDataToLocalStorage() {
    // Convert JavaScript object to text (JSON format)
    const dataAsText = JSON.stringify(appData);
    
    // Save to LocalStorage
    localStorage.setItem('financeAppData', dataAsText);
}

/* 
    FUNCTION: initializeApp
    This function runs when the page loads.
    It sets up everything and loads saved data.
*/
function initializeApp() {
    // Load saved data from LocalStorage
    loadDataFromLocalStorage();
    
    // Load income data into the form fields
    loadIncomeData();
    
    // Load expenses and display them
    displayExpenses();
    
    // Load goals and display them
    displayGoals();
    
    // Update budget analysis
    updateBudgetAnalysis();
    
    // Set up navigation (switching between sections)
    setupNavigation();
    
    // Set up calculator tabs
    setupCalculatorTabs();
    
    // Set up all event listeners (button clicks, input changes, etc.)
    setupEventListeners();
    
    // Set today's date as default for expense date field
    setDefaultDate();
}

/* 
    FUNCTION: setDefaultDate
    Sets today's date as the default value for the expense date input.
*/
function setDefaultDate() {
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // padStart adds leading zero if needed
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    // Set the date input field to today
    const dateInput = document.getElementById('expense-date');
    if (dateInput) {
        dateInput.value = dateString;
    }
}

/* 
    ========================================
    PART 2: NAVIGATION SETUP
    ========================================
    Handles switching between different sections (Income, Expenses, etc.)
*/

function setupNavigation() {
    // Get all navigation buttons
    const navButtons = document.querySelectorAll('.nav-button');
    
    // Add click listener to each button
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get which section to show from data-section attribute
            const sectionName = this.getAttribute('data-section');
            
            // Show that section
            showSection(sectionName);
            
            // Update active button styling
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/* 
    FUNCTION: showSection
    Shows the specified section and hides all others.
*/
function showSection(sectionName) {
    // Hide all sections
    const allSections = document.querySelectorAll('.content-section');
    allSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show the requested section
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        
        // If showing analysis section, update charts
        if (sectionName === 'analysis') {
            updateBudgetAnalysis();
        }
        
        // If showing calculators section, update calculator displays
        if (sectionName === 'calculators') {
            updateCalculatorDisplays();
        }
    }
}

/* 
    ========================================
    PART 3: CALCULATOR TABS SETUP
    ========================================
    Handles switching between different calculators
*/

function setupCalculatorTabs() {
    // Get all calculator tab buttons
    const calcTabs = document.querySelectorAll('.calc-tab');
    
    // Add click listener to each tab
    calcTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Get which calculator to show
            const calcName = this.getAttribute('data-calc');
            
            // Show that calculator
            showCalculator(calcName);
            
            // Update active tab styling
            calcTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

/* 
    FUNCTION: showCalculator
    Shows the specified calculator and hides all others.
*/
function showCalculator(calcName) {
    // Hide all calculators
    const allCalculators = document.querySelectorAll('.calculator-content');
    allCalculators.forEach(calc => {
        calc.classList.remove('active');
    });
    
    // Show the requested calculator
    const targetCalc = document.getElementById(calcName);
    if (targetCalc) {
        targetCalc.classList.add('active');
    }
}

/* 
    FUNCTION: updateCalculatorDisplays
    Updates the income/expense displays in calculators that use them.
*/
function updateCalculatorDisplays() {
    // Calculate total monthly income
    const totalIncome = appData.income.salary + appData.income.other;
    
    // Calculate total expenses
    const totalExpenses = calculateTotalExpenses();
    
    // Update displays in Monthly Savings calculator
    const incomeDisplay = document.getElementById('calc-income-display');
    const expensesDisplay = document.getElementById('calc-expenses-display');
    if (incomeDisplay) incomeDisplay.textContent = formatCurrency(totalIncome);
    if (expensesDisplay) expensesDisplay.textContent = formatCurrency(totalExpenses);
    
    // Update Emergency Fund calculator hint
    const emergencyHint = document.getElementById('emergency-expenses-hint');
    if (emergencyHint) {
        emergencyHint.textContent = formatCurrency(totalExpenses);
        // Auto-fill if field is empty
        const emergencyInput = document.getElementById('emergency-monthly-expenses');
        if (emergencyInput && !emergencyInput.value) {
            emergencyInput.value = totalExpenses;
        }
    }
}

/* 
    ========================================
    PART 4: INCOME TRACKING
    ========================================
    Handles income input, calculation, and display
*/

/* 
    FUNCTION: loadIncomeData
    Loads saved income data into the form fields.
*/
function loadIncomeData() {
    // Get the input fields
    const salaryInput = document.getElementById('salary-input');
    const otherIncomeInput = document.getElementById('other-income-input');
    
    // Set their values from saved data
    if (salaryInput) salaryInput.value = appData.income.salary || 0;
    if (otherIncomeInput) otherIncomeInput.value = appData.income.other || 0;
    
    // Update the display
    updateIncomeDisplay();
}

/* 
    FUNCTION: updateIncomeDisplay
    Calculates and displays total monthly and yearly income.
*/
function updateIncomeDisplay() {
    // Get income values (convert to numbers, default to 0 if empty)
    const salary = parseFloat(appData.income.salary) || 0;
    const other = parseFloat(appData.income.other) || 0;
    
    // Calculate totals
    const totalMonthly = salary + other;
    const totalYearly = totalMonthly * 12;
    
    // Update display elements
    const monthlyDisplay = document.getElementById('total-monthly-income');
    const yearlyDisplay = document.getElementById('total-yearly-income');
    
    if (monthlyDisplay) monthlyDisplay.textContent = formatCurrency(totalMonthly);
    if (yearlyDisplay) yearlyDisplay.textContent = formatCurrency(totalYearly);
    
    // Update calculator displays if calculators section is visible
    updateCalculatorDisplays();
    
    // Update budget analysis
    updateBudgetAnalysis();
}

/* 
    FUNCTION: handleIncomeInput
    Called when user types in income fields.
    Saves data and updates display in real-time.
*/
function handleIncomeInput(fieldName, value) {
    // Convert value to number (or 0 if empty/invalid)
    const numValue = parseFloat(value) || 0;
    
    // Update our data
    appData.income[fieldName] = numValue;
    
    // Save to LocalStorage
    saveDataToLocalStorage();
    
    // Update display
    updateIncomeDisplay();
}

/* 
    ========================================
    PART 5: EXPENSE TRACKING
    ========================================
    Handles adding, editing, deleting expenses
*/

/* 
    FUNCTION: addExpense
    Adds a new expense to the list.
*/
function addExpense() {
    // Get form values
    const categorySelect = document.getElementById('expense-category');
    const customCategoryInput = document.getElementById('custom-category-input');
    const amountInput = document.getElementById('expense-amount');
    const dateInput = document.getElementById('expense-date');
    
    // Validate inputs
    if (!categorySelect || !amountInput || !dateInput) {
        showError('Form fields not found.');
        return;
    }
    
    // Get category (use custom if selected)
    let category = categorySelect.value;
    if (category === 'Custom') {
        category = customCategoryInput ? customCategoryInput.value.trim() : '';
        if (!category) {
            showError('Please enter a custom category name.');
            return;
        }
    }
    
    // Get amount and validate
    const amount = parseFloat(amountInput.value);
    if (!amount || amount <= 0) {
        showError('Please enter a valid amount greater than 0.');
        return;
    }
    
    // Get date
    const date = dateInput.value;
    if (!date) {
        showError('Please select a date.');
        return;
    }
    
    // Create expense object
    // We use Date.now() to create a unique ID (timestamp)
    const expense = {
        id: Date.now(),         // Unique identifier
        category: category,     // Category name
        amount: amount,          // Amount spent
        date: date              // Date of expense
    };
    
    // Add to expenses array
    appData.expenses.push(expense);
    
    // Save to LocalStorage
    saveDataToLocalStorage();
    
    // Clear form
    if (amountInput) amountInput.value = '';
    if (customCategoryInput) {
        customCategoryInput.value = '';
        document.getElementById('custom-category-group').style.display = 'none';
    }
    categorySelect.value = 'Rent';
    setDefaultDate();
    
    // Update display
    displayExpenses();
    
    // Show success message
    showSuccess('Expense added successfully!');
}

/* 
    FUNCTION: deleteExpense
    Removes an expense from the list.
*/
function deleteExpense(expenseId) {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this expense?')) {
        return; // User cancelled
    }
    
    // Find and remove expense from array
    // filter() creates a new array with items that pass the test
    appData.expenses = appData.expenses.filter(expense => expense.id !== expenseId);
    
    // Save to LocalStorage
    saveDataToLocalStorage();
    
    // Update display
    displayExpenses();
    
    // Show success message
    showSuccess('Expense deleted successfully!');
}

/* 
    FUNCTION: editExpense
    Allows user to edit an existing expense.
*/
function editExpense(expenseId) {
    // Find the expense
    const expense = appData.expenses.find(exp => exp.id === expenseId);
    if (!expense) return;
    
    // Fill form with expense data
    const categorySelect = document.getElementById('expense-category');
    const amountInput = document.getElementById('expense-amount');
    const dateInput = document.getElementById('expense-date');
    const customCategoryInput = document.getElementById('custom-category-input');
    const customCategoryGroup = document.getElementById('custom-category-group');
    
    // Check if it's a custom category (not in the dropdown)
    const predefinedCategories = ['Rent', 'Food', 'Transport', 'Utilities', 'Entertainment'];
    if (predefinedCategories.includes(expense.category)) {
        categorySelect.value = expense.category;
        if (customCategoryGroup) customCategoryGroup.style.display = 'none';
    } else {
        categorySelect.value = 'Custom';
        if (customCategoryGroup) customCategoryGroup.style.display = 'block';
        if (customCategoryInput) customCategoryInput.value = expense.category;
    }
    
    if (amountInput) amountInput.value = expense.amount;
    if (dateInput) dateInput.value = expense.date;
    
    // Delete the old expense (we'll add it back with updated data)
    deleteExpense(expenseId);
    
    // Scroll to form
    document.getElementById('expenses').scrollIntoView({ behavior: 'smooth' });
}

/* 
    FUNCTION: displayExpenses
    Shows all expenses in a table format.
*/
function displayExpenses() {
    const expensesListDiv = document.getElementById('expenses-list');
    if (!expensesListDiv) return;
    
    // Check if there are any expenses
    if (appData.expenses.length === 0) {
        expensesListDiv.innerHTML = '<p class="empty-message">No expenses added yet. Add one above!</p>';
        updateExpenseSummary();
        return;
    }
    
    // Create table HTML
    let tableHTML = '<table class="expenses-table"><thead><tr>';
    tableHTML += '<th>Category</th>';
    tableHTML += '<th>Amount</th>';
    tableHTML += '<th>Date</th>';
    tableHTML += '<th>Actions</th>';
    tableHTML += '</tr></thead><tbody>';
    
    // Sort expenses by date (newest first)
    const sortedExpenses = [...appData.expenses].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });
    
    // Add each expense as a table row
    sortedExpenses.forEach(expense => {
        tableHTML += '<tr>';
        tableHTML += `<td>${expense.category}</td>`;
        tableHTML += `<td>${formatCurrency(expense.amount)}</td>`;
        tableHTML += `<td>${formatDate(expense.date)}</td>`;
        tableHTML += '<td>';
        tableHTML += `<button class="button-secondary" onclick="editExpense(${expense.id})">Edit</button> `;
        tableHTML += `<button class="button-danger" onclick="deleteExpense(${expense.id})">Delete</button>`;
        tableHTML += '</td>';
        tableHTML += '</tr>';
    });
    
    tableHTML += '</tbody></table>';
    
    // Update the HTML
    expensesListDiv.innerHTML = tableHTML;
    
    // Update summary (totals)
    updateExpenseSummary();
}

/* 
    FUNCTION: calculateTotalExpenses
    Calculates the sum of all expenses.
*/
function calculateTotalExpenses() {
    // Use reduce() to sum all amounts
    // reduce() goes through each item and accumulates a total
    return appData.expenses.reduce((total, expense) => {
        return total + (expense.amount || 0);
    }, 0);
}

/* 
    FUNCTION: updateExpenseSummary
    Updates the total expenses and remaining balance display.
*/
function updateExpenseSummary() {
    // Calculate totals
    const totalExpenses = calculateTotalExpenses();
    const totalIncome = (appData.income.salary || 0) + (appData.income.other || 0);
    const remainingBalance = totalIncome - totalExpenses;
    
    // Update display
    const totalExpensesDisplay = document.getElementById('total-expenses');
    const remainingBalanceDisplay = document.getElementById('remaining-balance');
    
    if (totalExpensesDisplay) {
        totalExpensesDisplay.textContent = formatCurrency(totalExpenses);
    }
    
    if (remainingBalanceDisplay) {
        remainingBalanceDisplay.textContent = formatCurrency(remainingBalance);
        // Change color based on positive/negative
        if (remainingBalance < 0) {
            remainingBalanceDisplay.style.color = '#dc3545'; // Red for negative
        } else {
            remainingBalanceDisplay.style.color = '#667eea'; // Blue for positive
        }
    }
    
    // Update budget analysis
    updateBudgetAnalysis();
}

/* 
    ========================================
    PART 6: SAVINGS CALCULATORS
    ========================================
    All the different calculator functions
*/

/* 
    CALCULATOR 1: MONTHLY SAVINGS
    Simple: Income - Expenses
*/
function calculateMonthlySavings() {
    const totalIncome = (appData.income.salary || 0) + (appData.income.other || 0);
    const totalExpenses = calculateTotalExpenses();
    const savings = totalIncome - totalExpenses;
    
    // Show result
    const resultDiv = document.getElementById('monthly-savings-result');
    const amountSpan = document.getElementById('monthly-savings-amount');
    
    if (resultDiv) resultDiv.style.display = 'block';
    if (amountSpan) amountSpan.textContent = formatCurrency(savings);
}

/* 
    CALCULATOR 2: EMERGENCY FUND
    Formula: Months × Monthly Expenses
*/
function calculateEmergencyFund() {
    const monthsInput = document.getElementById('emergency-months');
    const expensesInput = document.getElementById('emergency-monthly-expenses');
    
    if (!monthsInput || !expensesInput) return;
    
    const months = parseInt(monthsInput.value) || 0;
    const monthlyExpenses = parseFloat(expensesInput.value) || 0;
    
    if (months <= 0 || monthlyExpenses <= 0) {
        showError('Please enter valid values for months and expenses.');
        return;
    }
    
    const emergencyFund = months * monthlyExpenses;
    
    // Show result
    const resultDiv = document.getElementById('emergency-fund-result');
    const amountSpan = document.getElementById('emergency-fund-amount');
    
    if (resultDiv) resultDiv.style.display = 'block';
    if (amountSpan) amountSpan.textContent = formatCurrency(emergencyFund);
}

/* 
    CALCULATOR 3: FIXED DEPOSIT
    Formula: A = P(1 + r/n)^(nt)
    Where:
    A = Final amount
    P = Principal (initial amount)
    r = Annual interest rate (as decimal)
    n = Compounding frequency per year (12 for monthly)
    t = Time in years
*/
function calculateFixedDeposit() {
    const principalInput = document.getElementById('fd-principal');
    const rateInput = document.getElementById('fd-rate');
    const timeInput = document.getElementById('fd-time');
    
    if (!principalInput || !rateInput || !timeInput) return;
    
    const principal = parseFloat(principalInput.value) || 0;
    const rate = parseFloat(rateInput.value) || 0;
    const time = parseFloat(timeInput.value) || 0;
    
    if (principal <= 0 || rate <= 0 || time <= 0) {
        showError('Please enter valid values (all must be greater than 0).');
        return;
    }
    
    // Convert rate from percentage to decimal
    const r = rate / 100;
    
    // For fixed deposits, typically compounded monthly (n = 12)
    const n = 12;
    
    // Calculate: A = P(1 + r/n)^(nt)
    const finalAmount = principal * Math.pow(1 + (r / n), n * time);
    const interestEarned = finalAmount - principal;
    
    // Show results
    const resultDiv = document.getElementById('fixed-deposit-result');
    const finalAmountSpan = document.getElementById('fd-final-amount');
    const interestSpan = document.getElementById('fd-interest-earned');
    
    if (resultDiv) resultDiv.style.display = 'block';
    if (finalAmountSpan) finalAmountSpan.textContent = formatCurrency(finalAmount);
    if (interestSpan) interestSpan.textContent = formatCurrency(interestEarned);
}

/* 
    CALCULATOR 4: SIP (SYSTEMATIC INVESTMENT PLAN)
    Formula: FV = P × [((1+r)^n - 1) / r] × (1+r)
    Where:
    FV = Future Value
    P = Monthly investment
    r = Monthly interest rate (annual rate / 12)
    n = Number of months
*/
function calculateSIP() {
    const monthlyInput = document.getElementById('sip-monthly');
    const rateInput = document.getElementById('sip-rate');
    const yearsInput = document.getElementById('sip-years');
    
    if (!monthlyInput || !rateInput || !yearsInput) return;
    
    const monthlyInvestment = parseFloat(monthlyInput.value) || 0;
    const annualRate = parseFloat(rateInput.value) || 0;
    const years = parseFloat(yearsInput.value) || 0;
    
    if (monthlyInvestment <= 0 || annualRate <= 0 || years <= 0) {
        showError('Please enter valid values (all must be greater than 0).');
        return;
    }
    
    // Convert annual rate to monthly rate (as decimal)
    const monthlyRate = (annualRate / 100) / 12;
    
    // Calculate number of months
    const months = years * 12;
    
    // Calculate future value using SIP formula
    // FV = P × [((1+r)^n - 1) / r] × (1+r)
    const futureValue = monthlyInvestment * 
        (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    
    // Calculate total invested
    const totalInvested = monthlyInvestment * months;
    
    // Calculate returns (future value - total invested)
    const returns = futureValue - totalInvested;
    
    // Show results
    const resultDiv = document.getElementById('sip-result');
    const totalInvestedSpan = document.getElementById('sip-total-invested');
    const returnsSpan = document.getElementById('sip-returns');
    const finalAmountSpan = document.getElementById('sip-final-amount');
    
    if (resultDiv) resultDiv.style.display = 'block';
    if (totalInvestedSpan) totalInvestedSpan.textContent = formatCurrency(totalInvested);
    if (returnsSpan) returnsSpan.textContent = formatCurrency(returns);
    if (finalAmountSpan) finalAmountSpan.textContent = formatCurrency(futureValue);
}

/* 
    CALCULATOR 5: SIMPLE INTEREST
    Formula: SI = (P × R × T) / 100
    Where:
    SI = Simple Interest
    P = Principal
    R = Rate (percentage)
    T = Time (years)
*/
function calculateSimpleInterest() {
    const principalInput = document.getElementById('si-principal');
    const rateInput = document.getElementById('si-rate');
    const timeInput = document.getElementById('si-time');
    
    if (!principalInput || !rateInput || !timeInput) return;
    
    const principal = parseFloat(principalInput.value) || 0;
    const rate = parseFloat(rateInput.value) || 0;
    const time = parseFloat(timeInput.value) || 0;
    
    if (principal <= 0 || rate <= 0 || time <= 0) {
        showError('Please enter valid values (all must be greater than 0).');
        return;
    }
    
    // Calculate simple interest: SI = (P × R × T) / 100
    const interest = (principal * rate * time) / 100;
    
    // Total amount = Principal + Interest
    const totalAmount = principal + interest;
    
    // Show results
    const resultDiv = document.getElementById('simple-interest-result');
    const interestSpan = document.getElementById('si-interest');
    const totalSpan = document.getElementById('si-total');
    
    if (resultDiv) resultDiv.style.display = 'block';
    if (interestSpan) interestSpan.textContent = formatCurrency(interest);
    if (totalSpan) totalSpan.textContent = formatCurrency(totalAmount);
}

/* 
    CALCULATOR 6: COMPOUND INTEREST
    Formula: A = P(1 + r/n)^(nt)
    Where:
    A = Final amount
    P = Principal
    r = Annual interest rate (as decimal)
    n = Compounding frequency per year
    t = Time in years
*/
function calculateCompoundInterest() {
    const principalInput = document.getElementById('ci-principal');
    const rateInput = document.getElementById('ci-rate');
    const timeInput = document.getElementById('ci-time');
    const compoundInput = document.getElementById('ci-compound');
    
    if (!principalInput || !rateInput || !timeInput || !compoundInput) return;
    
    const principal = parseFloat(principalInput.value) || 0;
    const rate = parseFloat(rateInput.value) || 0;
    const time = parseFloat(timeInput.value) || 0;
    const compoundingFrequency = parseInt(compoundInput.value) || 12;
    
    if (principal <= 0 || rate <= 0 || time <= 0) {
        showError('Please enter valid values (all must be greater than 0).');
        return;
    }
    
    // Convert rate from percentage to decimal
    const r = rate / 100;
    
    // Calculate: A = P(1 + r/n)^(nt)
    const finalAmount = principal * Math.pow(1 + (r / compoundingFrequency), compoundingFrequency * time);
    
    // Calculate interest earned
    const interestEarned = finalAmount - principal;
    
    // Show results
    const resultDiv = document.getElementById('compound-interest-result');
    const finalAmountSpan = document.getElementById('ci-final-amount');
    const interestSpan = document.getElementById('ci-interest-earned');
    
    if (resultDiv) resultDiv.style.display = 'block';
    if (finalAmountSpan) finalAmountSpan.textContent = formatCurrency(finalAmount);
    if (interestSpan) interestSpan.textContent = formatCurrency(interestEarned);
}

/* 
    ========================================
    PART 7: GOAL PLANNING
    ========================================
    Handles creating, displaying, and tracking financial goals
*/

/* 
    FUNCTION: addGoal
    Creates a new financial goal.
*/
function addGoal() {
    const nameInput = document.getElementById('goal-name');
    const targetInput = document.getElementById('goal-target');
    const monthsInput = document.getElementById('goal-months');
    const savedInput = document.getElementById('goal-saved');
    
    if (!nameInput || !targetInput || !monthsInput || !savedInput) return;
    
    // Get and validate inputs
    const name = nameInput.value.trim();
    if (!name) {
        showError('Please enter a goal name.');
        return;
    }
    
    const target = parseFloat(targetInput.value) || 0;
    if (target <= 0) {
        showError('Please enter a valid target amount greater than 0.');
        return;
    }
    
    const months = parseInt(monthsInput.value) || 0;
    if (months <= 0) {
        showError('Please enter a valid time period (months) greater than 0.');
        return;
    }
    
    const saved = parseFloat(savedInput.value) || 0;
    if (saved < 0) {
        showError('Saved amount cannot be negative.');
        return;
    }
    
    if (saved > target) {
        showError('Saved amount cannot be greater than target amount.');
        return;
    }
    
    // Create goal object
    const goal = {
        id: Date.now(),     // Unique identifier
        name: name,         // Goal name
        target: target,     // Target amount
        months: months,     // Time period in months
        saved: saved        // Amount already saved
    };
    
    // Add to goals array
    appData.goals.push(goal);
    
    // Save to LocalStorage
    saveDataToLocalStorage();
    
    // Clear form
    nameInput.value = '';
    targetInput.value = '';
    monthsInput.value = '';
    savedInput.value = '0';
    
    // Update display
    displayGoals();
    
    // Show success message
    showSuccess('Goal created successfully!');
}

/* 
    FUNCTION: deleteGoal
    Removes a goal from the list.
*/
function deleteGoal(goalId) {
    if (!confirm('Are you sure you want to delete this goal?')) {
        return;
    }
    
    // Remove goal from array
    appData.goals = appData.goals.filter(goal => goal.id !== goalId);
    
    // Save to LocalStorage
    saveDataToLocalStorage();
    
    // Update display
    displayGoals();
    
    // Show success message
    showSuccess('Goal deleted successfully!');
}

/* 
    FUNCTION: updateGoalSaved
    Updates the amount saved for a goal.
*/
function updateGoalSaved(goalId, newSavedAmount) {
    const goal = appData.goals.find(g => g.id === goalId);
    if (!goal) return;
    
    const saved = parseFloat(newSavedAmount) || 0;
    if (saved < 0) {
        showError('Saved amount cannot be negative.');
        return;
    }
    
    if (saved > goal.target) {
        showError('Saved amount cannot be greater than target amount.');
        return;
    }
    
    goal.saved = saved;
    
    // Save to LocalStorage
    saveDataToLocalStorage();
    
    // Update display
    displayGoals();
}

/* 
    FUNCTION: displayGoals
    Shows all goals with progress bars.
*/
function displayGoals() {
    const goalsListDiv = document.getElementById('goals-list');
    if (!goalsListDiv) return;
    
    // Check if there are any goals
    if (appData.goals.length === 0) {
        goalsListDiv.innerHTML = '<p class="empty-message">No goals created yet. Create one above!</p>';
        return;
    }
    
    // Create HTML for each goal
    let goalsHTML = '';
    
    appData.goals.forEach(goal => {
        // Calculate progress percentage
        const progressPercentage = Math.min((goal.saved / goal.target) * 100, 100);
        
        // Calculate monthly savings needed
        const remainingAmount = goal.target - goal.saved;
        const monthlySavingsNeeded = remainingAmount / goal.months;
        
        // Create goal item HTML
        goalsHTML += '<div class="goal-item">';
        
        // Goal header (name and delete button)
        goalsHTML += '<div class="goal-header">';
        goalsHTML += `<span class="goal-name">${goal.name}</span>`;
        goalsHTML += `<button class="button-danger" onclick="deleteGoal(${goal.id})">Delete</button>`;
        goalsHTML += '</div>';
        
        // Goal details
        goalsHTML += '<div class="goal-details">';
        goalsHTML += `Target: ${formatCurrency(goal.target)} | `;
        goalsHTML += `Time: ${goal.months} months | `;
        goalsHTML += `Saved: ${formatCurrency(goal.saved)}`;
        goalsHTML += '</div>';
        
        // Progress bar
        goalsHTML += '<div class="progress-bar-container">';
        goalsHTML += `<div class="progress-bar-fill" style="width: ${progressPercentage}%"></div>`;
        goalsHTML += `<span class="progress-text">${progressPercentage.toFixed(1)}%</span>`;
        goalsHTML += '</div>';
        
        // Monthly savings needed
        goalsHTML += '<div class="goal-details">';
        goalsHTML += `Monthly savings needed: <strong>${formatCurrency(monthlySavingsNeeded)}</strong>`;
        goalsHTML += '</div>';
        
        // Update saved amount input
        goalsHTML += '<div class="form-group" style="margin-top: 0.5rem;">';
        goalsHTML += `<label>Update Saved Amount:</label>`;
        goalsHTML += `<input type="number" id="goal-saved-${goal.id}" value="${goal.saved}" step="100" min="0" max="${goal.target}" style="margin-bottom: 0.5rem;">`;
        goalsHTML += `<button class="button-secondary" onclick="updateGoalSaved(${goal.id}, document.getElementById('goal-saved-${goal.id}').value)">Update</button>`;
        goalsHTML += '</div>';
        
        goalsHTML += '</div>';
    });
    
    // Update the HTML
    goalsListDiv.innerHTML = goalsHTML;
}

/* 
    ========================================
    PART 8: BUDGET ANALYSIS
    ========================================
    Creates visual charts and statistics
*/

/* 
    FUNCTION: updateBudgetAnalysis
    Updates all charts and statistics in the analysis section.
*/
function updateBudgetAnalysis() {
    // Calculate totals
    const totalIncome = (appData.income.salary || 0) + (appData.income.other || 0);
    const totalExpenses = calculateTotalExpenses();
    const savings = totalIncome - totalExpenses;
    
    // Calculate savings percentage
    const savingsPercentage = totalIncome > 0 ? (savings / totalIncome) * 100 : 0;
    
    // Update summary statistics
    const savingsPercentageDisplay = document.getElementById('savings-percentage');
    const incomeDisplay = document.getElementById('analysis-income');
    const expensesDisplay = document.getElementById('analysis-expenses');
    const savingsDisplay = document.getElementById('analysis-savings');
    
    if (savingsPercentageDisplay) {
        savingsPercentageDisplay.textContent = `${savingsPercentage.toFixed(1)}%`;
    }
    if (incomeDisplay) incomeDisplay.textContent = formatCurrency(totalIncome);
    if (expensesDisplay) expensesDisplay.textContent = formatCurrency(totalExpenses);
    if (savingsDisplay) savingsDisplay.textContent = formatCurrency(savings);
    
    // Update bar chart
    updateBarChart(totalIncome, totalExpenses, savings);
    
    // Update category breakdown
    updateCategoryBreakdown();
}

/* 
    FUNCTION: updateBarChart
    Updates the income vs expenses bar chart.
*/
function updateBarChart(income, expenses, savings) {
    // Find the maximum value to scale bars (so longest bar is 100%)
    const maxValue = Math.max(income, expenses, Math.abs(savings), 1);
    
    // Calculate percentages
    const incomePercentage = (income / maxValue) * 100;
    const expensePercentage = (expenses / maxValue) * 100;
    const savingsPercentage = (Math.abs(savings) / maxValue) * 100;
    
    // Update income bar
    const incomeBar = document.getElementById('income-bar');
    const incomeBarValue = document.getElementById('income-bar-value');
    if (incomeBar) incomeBar.style.width = `${incomePercentage}%`;
    if (incomeBarValue) incomeBarValue.textContent = formatCurrency(income);
    
    // Update expense bar
    const expenseBar = document.getElementById('expense-bar');
    const expenseBarValue = document.getElementById('expense-bar-value');
    if (expenseBar) expenseBar.style.width = `${expensePercentage}%`;
    if (expenseBarValue) expenseBarValue.textContent = formatCurrency(expenses);
    
    // Update savings bar
    const savingsBar = document.getElementById('savings-bar');
    const savingsBarValue = document.getElementById('savings-bar-value');
    if (savingsBar) {
        savingsBar.style.width = `${savingsPercentage}%`;
        // Change color if negative
        if (savings < 0) {
            savingsBar.style.background = 'linear-gradient(90deg, #dc3545 0%, #c82333 100%)';
        } else {
            savingsBar.style.background = 'linear-gradient(90deg, #4facfe 0%, #00f2fe 100%)';
        }
    }
    if (savingsBarValue) savingsBarValue.textContent = formatCurrency(savings);
}

/* 
    FUNCTION: updateCategoryBreakdown
    Groups expenses by category and creates a pie chart.
*/
function updateCategoryBreakdown() {
    const categoryBreakdownDiv = document.getElementById('category-breakdown');
    const pieChartContainer = document.getElementById('pie-chart-container');
    const pieChart = document.getElementById('pie-chart');
    const pieLegend = document.getElementById('pie-legend');
    
    if (!categoryBreakdownDiv) return;
    
    // Check if there are expenses
    if (appData.expenses.length === 0) {
        categoryBreakdownDiv.innerHTML = '<p class="empty-message">Add some expenses to see category breakdown.</p>';
        if (pieChartContainer) pieChartContainer.style.display = 'none';
        return;
    }
    
    // Group expenses by category
    // This creates an object where keys are category names and values are totals
    const categoryTotals = {};
    appData.expenses.forEach(expense => {
        const category = expense.category;
        if (categoryTotals[category]) {
            categoryTotals[category] += expense.amount;
        } else {
            categoryTotals[category] = expense.amount;
        }
    });
    
    // Calculate total for percentage calculations
    const totalExpenses = calculateTotalExpenses();
    
    // Create list HTML
    let listHTML = '';
    const categories = Object.keys(categoryTotals).sort((a, b) => categoryTotals[b] - categoryTotals[a]);
    
    categories.forEach(category => {
        const amount = categoryTotals[category];
        const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
        
        listHTML += '<div class="category-item">';
        listHTML += `<span class="category-name">${category}</span>`;
        listHTML += `<span class="category-amount">${formatCurrency(amount)} (${percentage.toFixed(1)}%)</span>`;
        listHTML += '</div>';
    });
    
    categoryBreakdownDiv.innerHTML = listHTML;
    
    // Create pie chart if we have categories
    if (categories.length > 0 && pieChart && pieLegend) {
        createPieChart(categories, categoryTotals, totalExpenses);
        if (pieChartContainer) pieChartContainer.style.display = 'flex';
    }
}

/* 
    FUNCTION: createPieChart
    Creates a CSS-based pie chart using conic-gradient.
*/
function createPieChart(categories, categoryTotals, totalExpenses) {
    const pieChart = document.getElementById('pie-chart');
    const pieLegend = document.getElementById('pie-legend');
    
    if (!pieChart || !pieLegend) return;
    
    // Color palette for different categories
    const colors = [
        '#667eea', '#f093fb', '#4facfe', '#43e97b', 
        '#fa709a', '#fee140', '#30cfd0', '#a8edea'
    ];
    
    // Build conic-gradient string for pie chart
    let currentAngle = 0;
    let gradientParts = [];
    let legendHTML = '';
    
    categories.forEach((category, index) => {
        const amount = categoryTotals[category];
        const percentage = (amount / totalExpenses) * 100;
        const angle = (percentage / 100) * 360;
        
        const color = colors[index % colors.length];
        const startAngle = currentAngle;
        const endAngle = currentAngle + angle;
        
        // Add to gradient
        gradientParts.push(`${color} ${startAngle}deg ${endAngle}deg`);
        
        // Add to legend
        legendHTML += '<div class="legend-item">';
        legendHTML += `<div class="legend-color" style="background-color: ${color}"></div>`;
        legendHTML += `<span class="legend-label">${category}: ${formatCurrency(amount)}</span>`;
        legendHTML += '</div>';
        
        currentAngle = endAngle;
    });
    
    // Apply gradient to pie chart
    pieChart.style.background = `conic-gradient(${gradientParts.join(', ')})`;
    
    // Update legend
    pieLegend.innerHTML = legendHTML;
}

/* 
    ========================================
    PART 9: UTILITY FUNCTIONS
    ========================================
    Helper functions used throughout the app
*/

/* 
    FUNCTION: formatCurrency
    Formats a number as currency with ₹ symbol.
    Example: 50000 becomes "₹50,000"
*/
function formatCurrency(amount) {
    // Round to 2 decimal places
    const rounded = Math.round(amount * 100) / 100;
    
    // Add commas for thousands separator
    // toLocaleString() does this automatically
    return '₹' + rounded.toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}

/* 
    FUNCTION: formatDate
    Formats a date string (YYYY-MM-DD) to a readable format.
    Example: "2024-01-15" becomes "Jan 15, 2024"
*/
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/* 
    FUNCTION: showSuccess
    Shows a success message to the user.
*/
function showSuccess(message) {
    // Remove any existing messages
    removeMessages();
    
    // Create success message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'success-message';
    messageDiv.textContent = message;
    
    // Find the active section and add message at the top
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection) {
        activeSection.insertBefore(messageDiv, activeSection.firstChild);
        
        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }
}

/* 
    FUNCTION: showError
    Shows an error message to the user.
*/
function showError(message) {
    // Remove any existing messages
    removeMessages();
    
    // Create error message element
    const messageDiv = document.createElement('div');
    messageDiv.className = 'error-message';
    messageDiv.textContent = message;
    
    // Find the active section and add message at the top
    const activeSection = document.querySelector('.content-section.active');
    if (activeSection) {
        activeSection.insertBefore(messageDiv, activeSection.firstChild);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

/* 
    FUNCTION: removeMessages
    Removes any existing success/error messages.
*/
function removeMessages() {
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());
}

/* 
    ========================================
    PART 10: EVENT LISTENERS SETUP
    ========================================
    Connects all buttons and inputs to their functions
*/

function setupEventListeners() {
    // INCOME SECTION
    // Listen for changes in salary input
    const salaryInput = document.getElementById('salary-input');
    if (salaryInput) {
        salaryInput.addEventListener('input', function() {
            handleIncomeInput('salary', this.value);
        });
    }
    
    // Listen for changes in other income input
    const otherIncomeInput = document.getElementById('other-income-input');
    if (otherIncomeInput) {
        otherIncomeInput.addEventListener('input', function() {
            handleIncomeInput('other', this.value);
        });
    }
    
    // EXPENSES SECTION
    // Show/hide custom category input based on dropdown selection
    const categorySelect = document.getElementById('expense-category');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            const customGroup = document.getElementById('custom-category-group');
            if (customGroup) {
                if (this.value === 'Custom') {
                    customGroup.style.display = 'block';
                } else {
                    customGroup.style.display = 'none';
                }
            }
        });
    }
    
    // Add expense button
    const addExpenseBtn = document.getElementById('add-expense-btn');
    if (addExpenseBtn) {
        addExpenseBtn.addEventListener('click', addExpense);
    }
    
    // CALCULATORS SECTION
    // Monthly Savings calculator
    const calcMonthlySavingsBtn = document.getElementById('calc-monthly-savings-btn');
    if (calcMonthlySavingsBtn) {
        calcMonthlySavingsBtn.addEventListener('click', calculateMonthlySavings);
    }
    
    // Emergency Fund calculator
    const calcEmergencyBtn = document.getElementById('calc-emergency-btn');
    if (calcEmergencyBtn) {
        calcEmergencyBtn.addEventListener('click', calculateEmergencyFund);
    }
    
    // Fixed Deposit calculator
    const calcFdBtn = document.getElementById('calc-fd-btn');
    if (calcFdBtn) {
        calcFdBtn.addEventListener('click', calculateFixedDeposit);
    }
    
    // SIP calculator
    const calcSipBtn = document.getElementById('calc-sip-btn');
    if (calcSipBtn) {
        calcSipBtn.addEventListener('click', calculateSIP);
    }
    
    // Simple Interest calculator
    const calcSiBtn = document.getElementById('calc-si-btn');
    if (calcSiBtn) {
        calcSiBtn.addEventListener('click', calculateSimpleInterest);
    }
    
    // Compound Interest calculator
    const calcCiBtn = document.getElementById('calc-ci-btn');
    if (calcCiBtn) {
        calcCiBtn.addEventListener('click', calculateCompoundInterest);
    }
    
    // GOALS SECTION
    // Add goal button
    const addGoalBtn = document.getElementById('add-goal-btn');
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', addGoal);
    }
}

/* 
    ========================================
    PART 11: START THE APP
    ========================================
    This runs when the page finishes loading
*/

// Wait for the page to fully load before starting
// DOMContentLoaded means all HTML is loaded and ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the app
    initializeApp();
    
    // Show a welcome message
    console.log('Personal Finance Calculator loaded successfully!');
});

/* 
    ========================================
    END OF SCRIPT
    ========================================
    That's all the JavaScript! Every function has been explained
    so you can understand what it does and modify it if needed.
*/
