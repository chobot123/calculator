/*
add, subtract, multiply, divide, equals, 
numbers(0-9), clear, decimal, backspace

*/
const gridContainer = document.querySelector(`.grid`);
const numContainer = document.querySelectorAll(`.num`);
const opContainer = document.querySelector(`.op-container`);
const display = document.querySelector(`.display`);
const equals = document.querySelector(`#equal`);
const update = document.querySelector(`.update`);
const clear = document.querySelector(`#clear`);
const decimal = document.querySelector(`#decimal`);
const backspace = document.querySelector(`#backspace`);

let numPressed = [];
let numStored = [];
let operStored = "";


const add = (array) => {
    let sum = 0;
    return array.reduce((previousValue, currentValue) => {
        sum = Number(previousValue) + Number(currentValue);
        numStored.pop();
        numStored.pop();
        return sum;
    })
}
const sub = (array) => {
    let sum = 0;
    return array.reduce((previousValue, currentValue) => {
        sum = Number(previousValue) - Number(currentValue);
        numStored.pop();
        numStored.pop();
        return sum;
    })
}
const mult = (array) => {
    let sum = 0;
    return array.reduce((previousValue, currentValue) => {
        sum = Number(previousValue) * Number(currentValue);
        numStored.pop();
        numStored.pop();
        return sum;
    })
}
const div = (array) => {
    let sum = 0;
    return array.reduce((previousValue, currentValue) => {
        sum = Number(previousValue) / Number(currentValue);
        numStored.pop();
        numStored.pop();
        if(sum === Infinity){
            sum = "inf";
        }
        return sum;
    })
}

let storeNum = (e) => {
    if(display.innerHTML == numStored[0]){
        display.innerHTML = "";
    }
    if(numPressed.length < 10){
        numPressed.push(e.target.innerHTML);

        //if first number is 0 and theres more than one number
        if(numPressed[0] === "0" && numPressed.length > 1){
            if(numPressed[1] !== "."){
                numPressed.shift(); //remove the 0
                display.innerHTML = numPressed[0];
                selectOp();
                return;
            }
        }
        display.innerHTML += numPressed[numPressed.length-1];
    }
    selectOp(); //Activate operators AFTER a number is initially chosen
}

let convertDeci = () => {
    
    if(numPressed[0] === "0"){ //if first num is 0
        numPressed.push(".");
        display.innerHTML += numPressed[1];
    }
    else if(numPressed.length === 0){ //if no num yet and selected decimal
        numPressed.push("0");
        numPressed.push(".");
        display.innerHTML += numPressed[0];
        display.innerHTML += numPressed[1];
    }
    else { //see if there is any other decimal, if so, return, if not push
        let count = 0;
        for(let i=0;i<numPressed.length;i++){
            if(numPressed[i] === "."){
                count++;
            }
        }
        if(count >= 1){return;}
        numPressed.push(".");
        display.innerHTML += ".";
    }
}

//for each number add an event listener to add that number to numPressed
let selectNum = () => {
    for(let i=0; i<numContainer.length;i++){
        numContainer[i].addEventListener("click", storeNum);
    }
}

//two scenarios for operator selection:
//  1) 2 numbers then => equals
//  2) array of numbers then => equals

//selectOp has an event listener for each operator
let selectOp = () => {
    for(let i=0;i<opContainer.children.length;i++){
        opContainer.children[i].addEventListener("click", operate);
    }
}
//We want the solution of whatever was operated on to be array[0] and remove rest
let updateStored = (operator, array) => {
    if (operator  === "add") {
        numStored.push(add(numStored));
    }
    if (operator  === "sub") {
        numStored.push(sub(numStored));
    }
    if (operator  === "mult") {
        numStored.push(mult(numStored));
    }
    if (operator  === "div") {
        numStored.push(div(numStored));
    }
}

let operate = (e) => {
    numStored.push(numPressed.join(""));
    if(numStored[1] == ""){numStored.pop();}
    if(operStored !== ""){
        updateStored(operStored, numStored);
        if(numStored[0] === "inf"){
            alert(`ARE YOU TRYING TO DESTROY REALITY??`);
            reset();
            return;
        }
        display.innerHTML = numStored[0];
    }
    update.innerHTML = `${numStored[0]} ${e.target.innerHTML}`;
    operStored = e.target.id;
    numPressed = [];
    equals.addEventListener("click", finalAnswer);
}

let finalAnswer = () => {
    numStored.push(numPressed.join(""));
    updateStored(operStored, numStored);
    if(numStored[0] === "inf"){
        alert(`ARE YOU TRYING TO DESTROY REALITY??`);
        reset();
        return;
    }
    update.innerHTML += ` ${display.innerHTML} =`;
    display.innerHTML = numStored[0];
    operStored = "";
    numPressed = [];
    equals.removeEventListener("click", finalAnswer);
}

let reset = () => {
    numStored = [];
    numPressed = [];
    operStored = [];
    display.innerHTML = "";
    update.innerHTML = "";
}

let backOne = () => {
    let text = display.innerHTML;
    if(numPressed.length === 0 && numStored.length !== 0){
        numStored[0] = display.innerHTML;
    }
    else {
        display.innerHTML = text.substring(0, text.length-1);
        numPressed.pop();
    }
}

selectNum();
clear.addEventListener("click", reset);
decimal.addEventListener("click", convertDeci);
backspace.addEventListener("click", backOne);