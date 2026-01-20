const problemElement = document.getElementById('problem');
const answerElement = document.getElementById('answer');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const setupElement = document.getElementById('setup');
const gameElement = document.getElementById('game');
const statsElement = document.getElementById('stats');
const startBtn = document.getElementById('start-btn');
const timeSelect = document.getElementById('time-select');
const titleElement = document.querySelector('.main-title');
const gameOverElement = document.getElementById('game-over');
const finalScoreElement = document.getElementById('final-score');
const tryAgainBtn = document.getElementById('try-again-btn');
const changeSettingsBtn = document.getElementById('change-settings-btn');
const techniqueSelect = document.getElementById('technique-select');
const techniqueDescription = document.getElementById('technique-description');
const operationSettings = document.getElementById('operation-settings');
const mobileModeCheckbox = document.getElementById('mobile-mode-checkbox');
const mobileOptionsContainer = document.getElementById('mobile-options');


const descriptions = {
    '11-trick': 'x11: For a 2-digit number ab, the answer is a(a+b)b. If a+b > 9, carry the one. (e.g., 23 x 11 = 253) <br> ÷11: For a 3-digit number abc, if a+c=b, the answer is ac. (e.g., 583 / 11 = 53)',
    'middle-number': 'For two close even/odd numbers, find the middle number, square it, and subtract the square of the distance. (e.g., 18 * 22 = 20^2 - 2^2 = 396)',
    'squares': 'Calculate the square of the given number. (e.g., 25 * 25 = 625)',
    'square-roots': 'Calculate the square root of the given number. (e.g., √625 = 25)',
    'powers-of-2': 'Calculate the given power of 2. (e.g., 2^10 = 1024)',
    'primes-times': 'Calculate the product of the two prime numbers.',
    'ending-in-5': 'To square a number ending in 5 (e.g., N5), take N, calculate N*(N+1) and append 25. (e.g., 85*85 -> 8*9=72 -> 7225)',
    'ghost-100': 'For two numbers near 100, add one number to the other\'s distance from 100. Multiply the distances for the last two digits. (e.g., 96 * 97 -> 96+(-3)=93; (-4)*(-3)=12 -> 9312)',
    'double-halve': 'Half the even number, double the other number, then multiply. (e.g., 48 * 15 -> 24 * 30 = 720)',
    'quarters': 'Use fractions: 25=100/4, 50=100/2, 75=3*100/4, 125=1000/8.',
    'times-12': 'Multiply the number by 10, multiply it by 2, and add the results. (e.g., 45 * 12 = 450 + 90 = 540)'
};

let primes = [];
function getPrimes(max) {
    const sieve = [];
    const primesList = [];
    for (let i = 2; i <= max; ++i) {
        if (!sieve[i]) {
            primesList.push(i);
            for (let j = i << 1; j <= max; j += i) {
                sieve[j] = true;
            }
        }
    }
    return primesList;
}


techniqueSelect.addEventListener('change', () => {
    if (techniqueSelect.value === 'custom') {
        operationSettings.classList.remove('hidden');
    } else {
        operationSettings.classList.add('hidden');
    }
});

// Settings elements
const opCheckboxes = document.querySelectorAll('input[name="op"]');
const addMin1 = document.getElementById('add-min1');
const addMax1 = document.getElementById('add-max1');
const addMin2 = document.getElementById('add-min2');
const addMax2 = document.getElementById('add-max2');
const mulMin1 = document.getElementById('mul-min1');
const mulMax1 = document.getElementById('mul-max1');
const mulMin2 = document.getElementById('mul-min2');
const mulMax2 = document.getElementById('mul-max2');


let score = 0;
let timeLeft = 0;
let timer;
let currentProblem = {};
let isUntimed = false;
let enabledOperations = [];
let settings = {};
let selectedTechnique = 'custom';
let isMobileMode = false;

function getSettings() {
    selectedTechnique = techniqueSelect.value;
    isMobileMode = mobileModeCheckbox.checked;

    if (selectedTechnique === 'custom') {
        enabledOperations = Array.from(opCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
    }
    if (selectedTechnique === 'primes-times' && primes.length === 0) {
        primes = getPrimes(100); // Generate primes up to 100
    }

    settings = {
        add: {
            min1: parseInt(addMin1.value, 10) || 2,
            max1: parseInt(addMax1.value, 10) || 100,
            min2: parseInt(addMin2.value, 10) || 2,
            max2: parseInt(addMax2.value, 10) || 100,
        },
        mul: {
            min1: parseInt(mulMin1.value, 10) || 2,
            max1: parseInt(mulMax1.value, 10) || 12,
            min2: parseInt(mulMin2.value, 10) || 2,
            max2: parseInt(mulMax2.value, 10) || 100,
        }
    };
}


function secureRandom() {
    const randomValues = new Uint32Array(1);
    crypto.getRandomValues(randomValues);
    return randomValues[0] / (Math.pow(2, 32) - 1);
}

function generateNumber(min, max) {
    return Math.floor(secureRandom() * (max - min + 1)) + min;
}

function generateProblem() {
    switch (selectedTechnique) {
        case '11-trick':
            generate11TrickProblem();
            break;
        case 'middle-number':
            generateMiddleNumberTrickProblem();
            break;
        case 'squares':
            generateSquaresProblem();
            break;
        case 'square-roots':
            generateSquareRootsProblem();
            break;
        case 'powers-of-2':
            generatePowersOf2Problem();
            break;
        case 'primes-times':
            generatePrimesTimesProblem();
            break;
        case 'ending-in-5':
            generateEndingIn5Problem();
            break;
        case 'ghost-100':
            generateGhost100Problem();
            break;
        case 'double-halve':
            generateDoubleAndHalveProblem();
            break;
        case 'quarters':
            generateQuartersProblem();
            break;
        case 'times-12':
            generateTimes12Problem();
            break;
        case 'custom':
        default:
            generateCustomProblem();
            break;
    }
    if (isMobileMode) {
        generateMobileOptions();
    }
}

function generateCustomProblem() {
    if (enabledOperations.length === 0) {
        problemElement.textContent = "Select an operation.";
        return;
    }

    const operation = enabledOperations[generateNumber(0, enabledOperations.length - 1)];
    let num1, num2, answer, text;

    switch (operation) {
        case 'add':
            num1 = generateNumber(settings.add.min1, settings.add.max1);
            num2 = generateNumber(settings.add.min2, settings.add.max2);
            answer = num1 + num2;
            text = `${num1} + ${num2}`;
            break;
        case 'subtract':
            const add1 = generateNumber(settings.add.min1, settings.add.max1);
            const add2 = generateNumber(settings.add.min2, settings.add.max2);
            num1 = add1 + add2;
            num2 = secureRandom() > 0.5 ? add1 : add2;
            answer = num1 - num2;
            text = `${num1} - ${num2}`;
            break;
        case 'multiply':
            num1 = generateNumber(settings.mul.min1, settings.mul.max1);
            num2 = generateNumber(settings.mul.min2, settings.mul.max2);
            answer = num1 * num2;
            text = `${num1} × ${num2}`;
            break;
        case 'divide':
            const mul1 = generateNumber(settings.mul.min1, settings.mul.max1);
            const mul2 = generateNumber(settings.mul.min2, settings.mul.max2);
            num1 = mul1 * mul2;
            num2 = secureRandom() > 0.5 ? mul1 : mul2;
            if (num2 === 0) num2 = 1; // Avoid division by zero
            answer = num1 / num2;
            text = `${num1} ÷ ${num2}`;
            break;
    }

    currentProblem = { text, answer };
    problemElement.textContent = currentProblem.text;
}

function generate11TrickProblem() {
    const operation = secureRandom() > 0.5 ? 'multiply' : 'divide';
    let num1, num2, answer, text;

    if (operation === 'multiply') {
        num1 = 11;
        num2 = generateNumber(10, 99);
        answer = num1 * num2;
        text = `${num1} × ${num2}`;
    } else { // divide
        const n = generateNumber(10, 99);
        num1 = 11 * n;
        num2 = 11;
        answer = n;
        text = `${num1} ÷ ${num2}`;
    }

    currentProblem = { text, answer };
    problemElement.textContent = currentProblem.text;
}

function generateMiddleNumberTrickProblem() {
    const middle = generateNumber(10, 50);
    const distance = generateNumber(1, 5);
    const num1 = middle - distance;
    const num2 = middle + distance;
    const answer = num1 * num2;
    const text = `${num1} × ${num2}`;
    currentProblem = { text, answer };
    problemElement.textContent = currentProblem.text;
}

function generateSquaresProblem() {
    const num = generateNumber(1, 30);
    const answer = num * num;
    const text = `${num} × ${num}`;
    currentProblem = { text, answer };
    problemElement.textContent = currentProblem.text;
}

function generateSquareRootsProblem() {
    const num = generateNumber(1, 30);
    const answer = num;
    const text = `√${num * num}`;
    currentProblem = { text, answer };
    problemElement.textContent = currentProblem.text;
}

function generatePowersOf2Problem() {
    const power = generateNumber(1, 30);
    const answer = Math.pow(2, power);
    const text = `2^${power}`;
    currentProblem = { text, answer };
    problemElement.textContent = currentProblem.text;
}

function generatePrimesTimesProblem() {
    const prime1 = primes[generateNumber(0, primes.length - 1)];
    const prime2 = primes[generateNumber(0, primes.length - 1)];
    const answer = prime1 * prime2;
    const text = `${prime1} × ${prime2}`;
    currentProblem = { text, answer };
    problemElement.textContent = currentProblem.text;
}

function generateEndingIn5Problem() {
    const n = generateNumber(1, 20);
    const num = n * 10 + 5;
    const answer = num * num;
    const text = `${num} × ${num}`;
    currentProblem = { text, answer };
    problemElement.textContent = currentProblem.text;
}

function generateGhost100Problem() {
    const dist1 = generateNumber(1, 15);
    const dist2 = generateNumber(1, 15);
    const num1 = 100 - dist1;
    const num2 = 100 - dist2;
    const answer = num1 * num2;
    const text = `${num1} × ${num2}`;
    currentProblem = { text, answer };
    problemElement.textContent = currentProblem.text;
}

function generateDoubleAndHalveProblem() {
    const evenNum = generateNumber(5, 25) * 2;
    const numEndingIn5 = generateNumber(1, 5) * 10 - 5;
    const answer = evenNum * numEndingIn5;
    const text = `${evenNum} × ${numEndingIn5}`;
    currentProblem = { text, answer };
    problemElement.textContent = currentProblem.text;
}

function generateQuartersProblem() {
    const quarters = [25, 50, 75, 125];
    const quarter = quarters[generateNumber(0, quarters.length - 1)];
    let otherNum;
    if (quarter === 125) {
        otherNum = generateNumber(1, 10) * 8;
    } else if (quarter === 75) {
        otherNum = generateNumber(1, 15) * 4;
    }
    else {
        otherNum = generateNumber(1, 20) * 4;
    }
    const num1 = secureRandom() > 0.5 ? quarter : otherNum;
    const num2 = num1 === quarter ? otherNum : quarter;
    const answer = num1 * num2;
    const text = `${num1} × ${num2}`;
    currentProblem = { text, answer };
    problemElement.textContent = currentProblem.text;
}

function generateTimes12Problem() {
    const num = generateNumber(10, 99);
    const answer = num * 12;
    const text = `${num} × 12`;
    currentProblem = { text, answer };
    problemElement.textContent = currentProblem.text;
}

function generateMobileOptions() {
    const options = [currentProblem.answer];
    while (options.length < 4) {
        const wrongAnswer = currentProblem.answer + generateNumber(-10, 10);
        if (!options.includes(wrongAnswer) && wrongAnswer !== currentProblem.answer) {
            options.push(wrongAnswer);
        }
    }
    
    // Shuffle options
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(secureRandom() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }

    mobileOptionsContainer.innerHTML = '';
    options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', handleMobileAnswer);
        mobileOptionsContainer.appendChild(button);
    });
}

function handleMobileAnswer(event) {
    const selectedAnswer = parseInt(event.target.textContent, 10);
    if (selectedAnswer === currentProblem.answer) {
        score++;
    } else {
        score--;
    }
    scoreElement.textContent = score;
    generateProblem();
}

function handleInput() {
    if (answerElement.value === currentProblem.answer.toString()) {
        score++;
        scoreElement.textContent = score;
        answerElement.value = '';
        generateProblem();
    }
}

function startGame() {
    clearInterval(timer);
    getSettings();

    if (selectedTechnique === 'custom' && enabledOperations.length === 0) {
        alert("Please select at least one operation to start the game.");
        return;
    }
    
    if (selectedTechnique !== 'custom' && descriptions[selectedTechnique]) {
        techniqueDescription.innerHTML = descriptions[selectedTechnique];
        techniqueDescription.classList.remove('hidden');
    } else {
        techniqueDescription.classList.add('hidden');
    }

    const selectedTime = timeSelect.value;
    isUntimed = selectedTime === '0';
    timeLeft = parseInt(selectedTime, 10);
    
    score = 0;
    scoreElement.textContent = score;
    timerElement.textContent = isUntimed ? '∞' : timeLeft;
    
    titleElement.classList.add('hidden');
    setupElement.classList.add('hidden');
    gameOverElement.classList.add('hidden');
    gameElement.classList.remove('hidden');
    statsElement.classList.remove('hidden');
    answerElement.value = '';
    
    if (isMobileMode) {
        answerElement.style.display = 'none';
        mobileOptionsContainer.classList.remove('hidden');
    } else {
        answerElement.style.display = 'inline-block';
        mobileOptionsContainer.classList.add('hidden');
        answerElement.focus();
        answerElement.addEventListener('input', handleInput);
    }
    
    generateProblem();

    if (!isUntimed) {
        timer = setInterval(() => {
            timeLeft--;
            timerElement.textContent = timeLeft;
            if (timeLeft === 0) {
                endGame();
            }
        }, 1000);
    }
}

function endGame() {
    clearInterval(timer);
    answerElement.removeEventListener('input', handleInput);
    
    const mobileButtons = mobileOptionsContainer.querySelectorAll('button');
    mobileButtons.forEach(button => {
        button.removeEventListener('click', handleMobileAnswer);
    });

    gameElement.classList.add('hidden');
    statsElement.classList.add('hidden');
    techniqueDescription.classList.add('hidden');
    
    finalScoreElement.textContent = `Score: ${score}`;
    gameOverElement.classList.remove('hidden');
}

tryAgainBtn.addEventListener('click', startGame);

changeSettingsBtn.addEventListener('click', () => {
    gameOverElement.classList.add('hidden');
    titleElement.classList.remove('hidden');
    setupElement.classList.remove('hidden');
});

startBtn.addEventListener('click', startGame);

const darkModeToggle = document.getElementById('dark-mode-toggle');
const sunIcon = document.getElementById('sun-icon');
const moonIcon = document.getElementById('moon-icon');
const body = document.body;

function setDarkMode(isDark) {
    if (isDark) {
        body.classList.add('dark-mode');
        sunIcon.classList.add('hidden');
        moonIcon.classList.remove('hidden');
        localStorage.setItem('darkMode', 'enabled');
    } else {
        body.classList.remove('dark-mode');
        sunIcon.classList.remove('hidden');
        moonIcon.classList.add('hidden');
        localStorage.removeItem('darkMode');
    }
}

if (localStorage.getItem('darkMode') === 'enabled') {
    setDarkMode(true);
}

darkModeToggle.addEventListener('click', () => {
    setDarkMode(!body.classList.contains('dark-mode'));
});