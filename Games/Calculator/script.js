/* Dear programmer:
When i wrote this code only God and I knew how it worked.
Now, only God knows it!

Therefore, if you are trying to optimize this routine and it fails (most surely), please increase this counter as a warning for the next person

total hours wasted here = 9
*/

let step = 0;
let num1, num2, op;

const display = document.getElementById("display");
const input = document.getElementById("user-input");
const btn = document.getElementById("action-btn");
const counter = document.getElementById("counter");
const status = document.getElementById("status");

async function handleStep() {
    let val = input.value.trim();
    input.value = "";

    if (step === 3) {
        reset();
        return;
    }

    if (step === 0) {
        num1 = Number(val);

        if (!val || isNaN(num1)) {
            display.innerText = "Not a number. Try again.";
            return;
        }

        display.innerText = "Operation (+, -, *, /):";
        step = 1;
        return;
    }

    if (step === 1) {
        op = val;

        if (op !== "+" && op !== "-" && op !== "*" && op !== "/") {
            display.innerText = "Invalid. Use +, -, *, /:";
            return;
        }

        display.innerText = "Input second number:";
        step = 2;
        return;
    }

    if (step === 2) {
        num2 = Number(val);

        if (!val || isNaN(num2)) {
            display.innerText = "Not a number. Try again.";
            return;
        }

        processResult();
    }
}

async function processResult() {
    btn.disabled = true;
    status.innerText = "ANALYZING...";

    if (op === "/" && num2 === 0) {
        display.innerText = "Error: Physics engine failed. Division by zero.";
        endSession();
        return;
    }

    let finalAnswer;

    try {
        finalAnswer = eval(num1 + op + num2);
    } catch (e) {
        display.innerText = "Calculation too complex.";
        endSession();
        return;
    }
    
    if (num1 === 0 && num2 === 0 && op !== "/") {
        display.innerText = 'console.log("HelloWorld")';
        status.innerText = "hes saying the truth.";
        console.log("HelloWorld");
        endSession();
        return;
    }
    
    if (!Number.isInteger(finalAnswer) || finalAnswer < 0 || finalAnswer > 100) {
        display.innerText = "The answer is outside my paygrade (0-100). Do it yourself.";
        endSession();
        return;
    }

    const willFail = Math.random() < 0.2;

    let pool = [];
    for (let i = 0; i <= 100; i++) {
        pool.push(i);
    }

    for (let i = pool.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = pool[i];
        pool[i] = pool[j];
        pool[j] = temp;
    }

    for (let i = 0; i < pool.length; i++) {
        let guess = pool[i];

        display.innerText = `Is it ${guess}?`;
        counter.innerText = `Attempt ${i + 1} of 101`;

        await new Promise(r => setTimeout(r, 200 + i * 10));

        if (guess === finalAnswer) {
            if (willFail) {
                display.innerText = "...Actually, I'm tired. Figure it out yourself.";
                status.innerText = "EXHAUSTED";
            } else {
                display.innerText = `The answer is ${guess}. Don't ask again.`;
                status.innerText = "COMPLETED";
            }
            break;
        }
    }

    endSession();
}

function endSession() {
    btn.disabled = false;
    btn.innerText = "Start Over";
    step = 3;
}

function reset() {
    step = 0;
    num1 = undefined;
    num2 = undefined;
    op = undefined;

    display.innerText = "Input first number:";
    btn.innerText = "Submit";
    status.innerText = "IDLE (lazy ass)";
    counter.innerText = "";

    input.focus();
}
