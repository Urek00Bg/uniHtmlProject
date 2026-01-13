document.addEventListener('DOMContentLoaded', () => {
    // STATE: We track total income and total expenses separately
    let totalIncome = 0;
    let totalExpenses = 0;

    const budgetInput = document.getElementById('budget-amount');
    const updateBudgetBtn = document.querySelector('.dashboard_box:nth-child(1) button:nth-of-type(1)');
    const immediateExpInput = document.getElementById('immediate-expense');
    const logImmediateBtn = document.querySelector('.dashboard_box:nth-child(1) button:nth-of-type(2)');
    const addMoneyInput = document.getElementById('add-more-money');
    const addMoneyBtn = document.querySelector('.dashboard_box:nth-child(1) button:nth-of-type(3)');

    const bufferRange = document.getElementById('buffer-range');
    const bufferPctDisplay = document.getElementById('buffer-pct');
    const savingsRange = document.getElementById('savings-range');
    const savingsPctDisplay = document.getElementById('savings-pct');

    const reservedDisplay = document.getElementById('reserved-sum');
    const savingsDisplay = document.getElementById('savings-sum');
    const availableDisplay = document.getElementById('available-sum');

    const expNameInput = document.getElementById('expense-name');
    const expAmountInput = document.getElementById('expense-amount');
    const logExpBtn = document.querySelector('.inputs_log-expense button');

    function updateUI() {
        const bPct = parseFloat(bufferRange.value) || 0;
        const sPct = parseFloat(savingsRange.value) || 0;

        bufferPctDisplay.textContent = bPct;
        savingsPctDisplay.textContent = sPct;

        // 1. Calculate the "Locked" amounts based on Total Income
        const reservedBuffer = totalIncome * (bPct / 100);
        const reservedSavings = totalIncome * (sPct / 100);

        // 2. Available = (Total Income - Locked Amounts) - All Expenses logged
        const available = (totalIncome - reservedBuffer - reservedSavings) - totalExpenses;

        reservedDisplay.textContent = `$${reservedBuffer.toFixed(2)}`;
        savingsDisplay.textContent = `$${reservedSavings.toFixed(2)}`;
        availableDisplay.textContent = `$${available.toFixed(2)}`;
        
        availableDisplay.style.color = available < 0 ? "#e74c3c" : "#2ecc71";
    }

    // Adding to Income
    updateBudgetBtn.addEventListener('click', () => {
        const val = parseFloat(budgetInput.value) || 0;
        if (val > 0) {
            totalIncome += val;
            addTransactionToHistory('income', 'Initial Budget', val);
            updateUI();
            budgetInput.value = '';
        }
    });

    addMoneyBtn.addEventListener('click', () => {
        const val = parseFloat(addMoneyInput.value) || 0;
        if (val > 0) {
            totalIncome += val;
            addTransactionToHistory('income', 'Extra Income', val);
            updateUI();
            addMoneyInput.value = '';
        }
    });

    // Subtracting from Available (Total Expenses)
    logImmediateBtn.addEventListener('click', () => {
        const val = parseFloat(immediateExpInput.value) || 0;
        if (val > 0) {
            totalExpenses += val;
            addTransactionToHistory('expense', 'Fixed Expense', val);
            updateUI();
            immediateExpInput.value = '';
        }
    });

    logExpBtn.addEventListener('click', () => {
        const name = expNameInput.value || 'General Expense';
        const val = parseFloat(expAmountInput.value) || 0;
        if (val > 0) {
            totalExpenses += val;
            addTransactionToHistory('expense', name, val);
            updateUI();
            expNameInput.value = '';
            expAmountInput.value = '';
        }
    });

    bufferRange.addEventListener('input', updateUI);
    savingsRange.addEventListener('input', updateUI);
});

function addTransactionToHistory(type, name, amount) {
    const list = document.getElementById('transaction-list');
    const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const row = document.createElement('div');
    row.classList.add('history-row', type); 
    const prefix = type === 'income' ? '+' : '-';
    row.innerHTML = `
        <div>${date}</div>
        <div>${name}</div>
        <div class="${type}-color">${prefix}$${Math.abs(amount).toFixed(2)}</div>
    `;
    list.insertBefore(row, list.firstChild);
}