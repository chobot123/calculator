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
let placeholder = [];



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

// -----------------------------------------------------------------------------------//

let storeNum = (e) => {
    let displayString = display.innerHTML;
    let hasE = false;
    for(let i=0;i<displayString.length;i++){ //get a boolean for if string was simplified (ie has "e")
        if(displayString[i] === "e"){
            hasE = true;
        }
    }

    if(display.innerHTML === numStored[0] || hasE === true){
        display.innerHTML = "";
    }
    if(numPressed.length < 14){
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
    if(numPressed.length === 14){
        return;
    }
    else if(numPressed[0] === "0"){ //if first num is 0
        numPressed.push(".");
        display.innerHTML += numPressed[1];
    }
    else if(numPressed.length === 0){ //if no num yet and selected decimal
        numPressed.push("0");
        numPressed.push(".");
        display.innerHTML = "";
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
/*
    1) check if length > 14
*/
let simplify = () => {
    let newString = "";
    let oldString = numStored[0].toString();
    let index = oldString.length;
    let left = 0;
    let right = 0;
    let count = 0;

    for(let i=0;i<oldString.length;i++){
        if(i < 14){newString += oldString[i];}//newString is number but up to 14 digits
        if(oldString[i] === "."){index = i;}
    }
    left = oldString.substring(0, index).length;
    right = oldString.substring(index+1, oldString.length).length;

    if(left > 14){ // 99999999999999|9999.1231231321 -- length 29
        count = left - 14; //4 -> ...to the power of
        //count = 18 - 14 = 4 => substring(0, 13 - 1)
        newString = oldString.substring(0, 13 - (count.toString().length)) + `e${count}`; // 999999999999e4
    }
    else if(left === 14){
        newString = oldString.substring(0, index);
    }
    else { // 1699999999998.3 length - 15 left -13 right 1
        /*
        count = 14 - right;
        console.log(Number(oldString));
        newString = Number(oldString).toFixed(count);
        console.log(newString);
        //newString = Number(oldString).toFixed(count);
        */
       if(oldString.at(15) === "."){
           newString = Math.round(Number(oldString.substring(0,15)));
       }
       else{
        newString = Number(oldString.substring(0,15)).toFixed(oldString.length - right);
       }
    }
    numStored[0] = newString;
}
//I need to get the number convert it if it is too big and then display it
let operate = (e) => {
    numStored.push(numPressed.join("")); //combines all number inputs into one number
    placeholder = numStored[0]; //placeholder takes numerical value of num 0 //gets operator
    if(numStored[1] == ""){ //if there happens to be an empty string pop it
        numStored.pop();} 
    if(operStored !== ""){ //if an operator was selected
        if(numStored.length === 2){ //if there are two numbers to calculate with
            updateStored(operStored, numStored); //do calculation
            placeholder = numStored[0]; //in case the number was beyong display scope, have placeholder take value for l8er
            let num = numStored[0].toString(); //get length of number
            if(numStored[0] === "inf"){ //if the output is inf reset calculator
                alert(`ARE YOU TRYING TO DESTROY REALITY??`);
                reset();
                return;
            }
            if(num.length > 14){ //if the length is > 14
                //alert(`the value exceeds the scope of the display. Your answer was rounded.`)
                simplify(); //Simplify the value to fit the scope
            }
            
            console.log(placeholder);
            display.innerHTML = numStored[0]; //main display => show the calculated number
        }
    }
    operStored = e.target.id;
    update.innerHTML = `${numStored[0]} ${e.target.innerHTML}`;
    display.innerHTML = numStored[0];
    console.log(numStored[0])
    numStored[0] = placeholder;
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