document.addEventListener('DOMContentLoaded', () => {
    const num1Input = document.getElementById('num1');
    const num2Input = document.getElementById('num2');
    const resultDisplay = document.getElementById('result');
    const errorMsg = document.getElementById('error-msg');
    const opBtns = document.querySelectorAll('.op-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const historyList = document.getElementById('history-list');
    const clearHistoryBtn = document.getElementById('clear-history');

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Helper functions
    const clearError = () => {
        errorMsg.textContent = '';
    };

    const showError = (msg) => {
        errorMsg.textContent = msg;
        resultDisplay.textContent = 'Error';
        animateResult();
    };

    const animateResult = () => {
        resultDisplay.classList.remove('animate');
        // Trigger reflow
        void resultDisplay.offsetWidth;
        resultDisplay.classList.add('animate');
    };

    const formatNumber = (num) => {
        // Prevent floating point errors e.g. 0.1 + 0.2 = 0.30000000000000004
        return parseFloat(num.toFixed(8));
    };

    const addToHistory = (n1, n2, opSymbol, res) => {
        const li = document.createElement('li');
        li.className = 'history-item';
        
        const eqDiv = document.createElement('div');
        eqDiv.className = 'eq';
        eqDiv.textContent = `${n1} ${opSymbol} ${n2} =`;
        
        const resDiv = document.createElement('div');
        resDiv.className = 'res';
        resDiv.textContent = res;
        
        li.appendChild(eqDiv);
        li.appendChild(resDiv);
        
        historyList.insertBefore(li, historyList.firstChild);
    };

    // Calculate Logic
    const calculate = (operation) => {
        clearError();
        
        const val1 = num1Input.value.trim();
        const val2 = num2Input.value.trim();

        if (val1 === '' || val2 === '') {
            showError('Please enter both values');
            return;
        }

        const n1 = parseFloat(val1);
        const n2 = parseFloat(val2);

        if (isNaN(n1) || isNaN(n2)) {
            showError('Inputs must be valid numbers');
            return;
        }

        let res;
        let opSymbol;

        switch (operation) {
            case 'add':
                res = n1 + n2;
                opSymbol = '+';
                break;
            case 'sub':
                res = n1 - n2;
                opSymbol = '-';
                break;
            case 'mul':
                res = n1 * n2;
                opSymbol = '×';
                break;
            case 'div':
                if (n2 === 0) {
                    showError('Cannot divide by zero');
                    return;
                }
                res = n1 / n2;
                opSymbol = '÷';
                break;
            default:
                return;
        }

        res = formatNumber(res);
        resultDisplay.textContent = res;
        animateResult();
        addToHistory(n1, n2, opSymbol, res);
    };

    // Event Listeners for Operations
    opBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const op = btn.getAttribute('data-op');
            calculate(op);
        });
    });

    // Clear History
    clearHistoryBtn.addEventListener('click', () => {
        historyList.innerHTML = '';
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
        const active = document.activeElement;
        const isInputFocus = active === num1Input || active === num2Input;
        
        // Allow typing negative sign in input if empty
        if (e.key === '-' && isInputFocus && active.value === '') {
            return;
        }

        if (['+', '-', '*', '/'].includes(e.key)) {
            e.preventDefault();
            if (e.key === '+') calculate('add');
            if (e.key === '-') calculate('sub');
            if (e.key === '*') calculate('mul');
            if (e.key === '/') calculate('div');
        } else if (e.key === 'Enter') {
            e.preventDefault();
            // If they press enter, let's just trigger calculation if both filled, maybe default to add?
            // Since there's no default operator, we might just focus the next field
            if (active === num1Input) {
                num2Input.focus();
            }
        }
    });
});
