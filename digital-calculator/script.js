class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.currentMode = 'simple';
        this.lastAnswer = 0;
        this.memory = 0;
        
        this.currentOperandElement = document.getElementById('currentOperand');
        this.previousOperandElement = document.getElementById('previousOperand');
        this.simpleCalculator = document.getElementById('simpleCalculator');
        this.scientificCalculator = document.getElementById('scientificCalculator');
        this.simpleModeBtn = document.getElementById('simpleMode');
        this.scientificModeBtn = document.getElementById('scientificMode');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateDisplay();
    }

    setupEventListeners() {
        // Mode switching
        this.simpleModeBtn.addEventListener('click', () => this.switchMode('simple'));
        this.scientificModeBtn.addEventListener('click', () => this.switchMode('scientific'));
        
        // Number buttons
        document.querySelectorAll('[data-number]').forEach(button => {
            button.addEventListener('click', () => {
                this.appendNumber(button.dataset.number);
                this.updateDisplay();
                this.animateButton(button);
            });
        });

        // Operation buttons
        document.querySelectorAll('[data-operation]').forEach(button => {
            button.addEventListener('click', () => {
                this.chooseOperation(button.dataset.operation);
                this.updateDisplay();
                this.animateButton(button);
            });
        });

        // Scientific function buttons
        document.querySelectorAll('[data-function]').forEach(button => {
            button.addEventListener('click', () => {
                this.executeScientificFunction(button.dataset.function);
                this.updateDisplay();
                this.animateButton(button);
            });
        });

        // Action buttons
        document.querySelectorAll('[data-action]').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                if (action === 'clear') {
                    this.clear();
                } else if (action === 'delete') {
                    this.delete();
                } else if (action === 'equals') {
                    this.compute();
                }
                this.updateDisplay();
                this.animateButton(button);
            });
        });

        // Keyboard support
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9') {
                this.appendNumber(e.key);
            } else if (e.key === '.') {
                this.appendNumber('.');
            } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') {
                const operationMap = {
                    '+': 'add',
                    '-': 'subtract',
                    '*': 'multiply',
                    '/': 'divide'
                };
                this.chooseOperation(operationMap[e.key]);
            } else if (e.key === 'Enter' || e.key === '=') {
                this.compute();
            } else if (e.key === 'Escape') {
                this.clear();
            } else if (e.key === 'Backspace') {
                this.delete();
            }
            this.updateDisplay();
        });
    }

    switchMode(mode) {
        this.currentMode = mode;
        
        if (mode === 'simple') {
            this.simpleCalculator.classList.remove('hidden');
            this.scientificCalculator.classList.add('hidden');
            this.simpleModeBtn.classList.add('active');
            this.scientificModeBtn.classList.remove('active');
        } else {
            this.simpleCalculator.classList.add('hidden');
            this.scientificCalculator.classList.remove('hidden');
            this.simpleModeBtn.classList.remove('active');
            this.scientificModeBtn.classList.add('active');
        }
    }

    executeScientificFunction(func) {
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(current)) {
            this.showError('Invalid input');
            return;
        }

        let result;
        
        switch (func) {
            case 'sin':
                result = Math.sin(current * Math.PI / 180); // Convert to radians
                break;
            case 'cos':
                result = Math.cos(current * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(current * Math.PI / 180);
                break;
            case 'ln':
                if (current <= 0) {
                    this.showError('Invalid input for ln');
                    return;
                }
                result = Math.log(current);
                break;
            case 'log':
                if (current <= 0) {
                    this.showError('Invalid input for log');
                    return;
                }
                result = Math.log10(current);
                break;
            case 'sqrt':
                if (current < 0) {
                    this.showError('Invalid input for sqrt');
                    return;
                }
                result = Math.sqrt(current);
                break;
            case 'pow2':
                result = Math.pow(current, 2);
                break;
            case 'pow':
                this.chooseOperation('pow');
                return;
            case 'pi':
                this.currentOperand = Math.PI.toString();
                this.shouldResetScreen = true;
                return;
            case 'factorial':
                if (current < 0 || current !== Math.floor(current)) {
                    this.showError('Invalid input for factorial');
                    return;
                }
                result = this.factorial(current);
                break;
            case 'reciprocal':
                if (current === 0) {
                    this.showError('Cannot divide by zero');
                    return;
                }
                result = 1 / current;
                break;
            case 'percent':
                result = current / 100;
                break;
            case 'exp':
                result = Math.exp(current);
                break;
            case 'abs':
                result = Math.abs(current);
                break;
            case 'negate':
                result = -current;
                break;
            case 'ans':
                this.currentOperand = this.lastAnswer.toString();
                this.shouldResetScreen = true;
                return;
            case 'e':
                this.currentOperand = Math.E.toString();
                this.shouldResetScreen = true;
                return;
            default:
                return;
        }
        
        this.lastAnswer = result;
        this.currentOperand = this.formatNumber(result);
        this.shouldResetScreen = true;
    }

    factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
        this.removeError();
    }

    delete() {
        if (this.currentOperand === '0') return;
        
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
        
        this.removeError();
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }

        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else {
            this.currentOperand += number;
        }
        
        this.removeError();
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
        this.shouldResetScreen = false;
        this.removeError();
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    this.showError('Cannot divide by zero');
                    return;
                }
                computation = prev / current;
                break;
            case 'pow':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }
        
        // Handle very large or very small numbers
        if (!isFinite(computation)) {
            this.showError('Result is too large');
            return;
        }
        
        this.lastAnswer = computation;
        this.currentOperand = this.formatNumber(computation);
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    formatNumber(number) {
        // Convert to string and handle scientific notation for very large/small numbers
        if (Math.abs(number) >= 1e10 || (Math.abs(number) < 1e-10 && number !== 0)) {
            return number.toExponential(6);
        }
        
        // Round to avoid floating point precision issues
        const roundedNumber = Math.round(number * 100000000) / 100000000;
        
        // Convert to string and remove trailing zeros
        let stringNumber = roundedNumber.toString();
        
        // If the number is an integer, don't show decimal point
        if (stringNumber.includes('.') && stringNumber.endsWith('.00000000')) {
            return Math.round(number).toString();
        }
        
        return stringNumber;
    }

    updateDisplay() {
        this.currentOperandElement.textContent = this.currentOperand;
        
        if (this.operation != null) {
            const operationSymbol = this.getOperationSymbol(this.operation);
            this.previousOperandElement.textContent = `${this.previousOperand} ${operationSymbol}`;
        } else {
            this.previousOperandElement.textContent = this.previousOperand;
        }
    }

    getOperationSymbol(operation) {
        const symbols = {
            add: '+',
            subtract: '−',
            multiply: '×',
            divide: '÷'
        };
        return symbols[operation] || '';
    }

    animateButton(button) {
        button.classList.add('pressed');
        setTimeout(() => {
            button.classList.remove('pressed');
        }, 100);
    }

    showError(message) {
        this.currentOperandElement.textContent = message;
        this.currentOperandElement.parentElement.classList.add('error');
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = true;
    }

    removeError() {
        this.currentOperandElement.parentElement.classList.remove('error');
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Calculator();
});
