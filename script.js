
//containers
const gridContainer = document.querySelector(`.grid`);
const numContainer = document.querySelectorAll(`.num`);
const opContainer = document.querySelector(`.op-container`);
const display = document.querySelector(`.display`);
const equals = document.querySelector(`#equal`);
const update = document.querySelector(`.update`);
const clear = document.querySelector(`#clear`);
const decimal = document.querySelector(`#decimal`);
const backspace = document.querySelector(`#backspace`);

//global variables
let numPressed = []; //keeps track of numbers pressed before operator
let numStored = []; //keeps track of 2 numbers pressed to calculate
let operStored = ""; //stores the operator
let placeholder = []; //holds value of numStored before numStored is converted to fit display


/*
    <--------- CALCULATION FUNCTIONS ------------->
*/
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

//Stores the digits into numPressed and displays each digit
let storeNum = (e) => {
    let displayString = display.innerHTML;
    let hasE = false;

    for(let i=0;i<displayString.length;i++){ //get a boolean for if string was simplified (ie has "e")
        if(displayString[i] === "e"){
            hasE = true;
        }
    }

    if(numPressed.length === 0 || hasE === true){//case for when display has an 'e'
        display.innerHTML = "";
    }

    if(numPressed.length < 14){ //keeps displaying and storing digits until display cap
        if(numPressed[0] == "0" && numPressed.length === 1){
            numPressed.pop();
            display.innerHTML = "";
        }
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
    if(numPressed.length !== 0){ //if there are numbers selected activate equals operator
        equals.addEventListener("click", operate);
    }
}

//conver to decimal
let convertDeci = () => {
    if(numPressed.length === 14){ //if digit cap then just return
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

//above but removes instead
let remNum = () => {
    for(let i=0; i<numContainer.length;i++){
        numContainer[i].removeEventListener("click", storeNum);
    }
}

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
    1) check if length > 14 and then either rounds or converts in terms of 'e'
*/
let simplify = (array) => {
    let newString = "";
    let oldString = array[0].toString();
    let index = oldString.length;
    let left = 0;
    let right = 0;
    let count = 0;
    let eCount = 0;

    for(let i=0;i<oldString.length;i++){
        if(i < 14){newString += oldString[i];}//newString is number but up to 14 digits
        if(oldString[i] === "."){index = i;}
        if(oldString[i] === "e"){eCount = 1}
    }
    left = oldString.substring(0, index).length;
    right = oldString.substring(index+1, oldString.length).length;

    if(left > 14){ //case where digits left of decimal exceed display
        count = left - 14; 
        newString = oldString.substring(0, 13 - (count.toString().length)) + `e${count}`;
    }
    else if(left === 14 && eCount === 0){ //if left digits equal display count and has no 'e'
        newString = oldString.substring(0, index);
    }
    else if(oldString.at(15) === "."){ //does left > 14 but first checks if theres a decimal
           newString = Math.round(Number(oldString.substring(0,15)));
    }
    else if(right > 14 && eCount === 0){ //if digits right of decimal exceed display and has no 'e'
        //loop through - look for first number -> round it to 3 decimal places -> add e^(count)
        let count = 0;
        let index = 0;
        for(let i=oldString.indexOf(".");i<oldString.length;i++){
            if(oldString[i] !== "." && oldString[i] !== "0"){
                index = i;
                break;
            }
            count++;
        }
        newString = `${oldString[index]}.${oldString.substring(index+1)}`;
        newString = Number(newString).toFixed(3);
        newString += `e-${count}`;
    }
    else {
        if(eCount === 1){//if there is an 'e' (from conversion or math)
            count = oldString.substring(oldString.indexOf("e")).length; //get count of characters on and after 'e'
            newString = oldString.substring(0, 14 - count); 
            newString += oldString.substring(oldString.indexOf("e"));

            while(newString.charAt(newString.indexOf("e")-1) === "0"){ //get characters before the e usually case for large decimal numbers (ie 1.00000000007)
                let temp = "";
                for(let i=0;i<newString.length;i++){ //use loops to delete characters to make space for 'e+/-#' and delete strings of '0'
                    if(newString[i+1] === "e"){
                        continue;
                    }
                    temp += newString[i];
                }
                newString = temp;
            }
        }
        else{   
            newString = Number(oldString.substring(0,15));
        }
    }
    return newString;
}

//I need to get the number convert it if it is too big and then display it
let operate = (e) => {
    if(e.target.innerHTML !== "equals"){ //if the operator isn't = then remove = operator
        equals.removeEventListener("click", operate);
    }
    else {
        equals.addEventListener("click", operate); //else activate =
    }
    decimal.addEventListener("click", convertDeci); //add the decimal operator
    selectNum(); //activate numbers after operator is selected

    numStored.push(numPressed.join("")); //combines all number inputs into one number
    placeholder = numStored[0]; //placeholder takes numerical value of num 0 //gets operator
    if(numStored[1] == ""){ //if there happens to be an empty string pop it
        numStored.pop();} 
    if(operStored !== ""){ //if an operator was selected
        let num = "";
        if(numStored.length === 2){ //if there are two numbers to calculate with
            if(operStored === "equal"){
                operStored = e.target.innerHTML;
            }
            updateStored(operStored, numStored); //do calculation
            placeholder = numStored[0]; //in case the number was beyong display scope, have placeholder take value for l8er
            if(numStored[0] === "inf"){ //if the output is inf reset calculator
                alert(`ARE YOU TRYING TO DESTROY REALITY??`);
                reset();
                return;
            }
        }
        num = numStored[0].toString(); //get length of number
        if(num.length >= 14){ //if the length is > 14
            //alert(`the value exceeds the scope of the display. Your answer was rounded.`)
            numStored[0] = simplify(numStored); //Simplify the value to fit the scope
        }
    }
    if(numPressed.length === 0){ //if no numbers pressed then skip operations
        operStored = e.target.id;
        update.innerHTML = `${numStored[0]} ${e.target.innerHTML}`;
        return;
    }

    operStored = e.target.id;
    if(e.target.id === "equal"){ //if the operator is equal, update the numbers displayed and remove decimal operator and numbers selection (ie have to choose operator to continue)
        update.innerHTML = ` ${update.innerHTML} ${numPressed.join("")} =`;
        display.innerHTML = numStored[0];
        numStored[0] = placeholder; 
        numPressed = [];
        //operStored = update.innerHTML.at(16)
        //equals.removeEventListener("click", operate);
        decimal.removeEventListener("click", convertDeci);
        remNum();
        return;
    }
    else {
        update.innerHTML = `${numStored[0]} ${e.target.innerHTML}`;
    }
    display.innerHTML = numStored[0];
    numStored[0] = placeholder;
    numPressed = [];
}

//clears display and data
let reset = () => {
    numStored = [];
    numPressed = [];
    operStored = [];
    inputContainer = [];
    placeholder = "";
    display.innerHTML = "";
    update.innerHTML = "";
    equals.removeEventListener("click", operate);
    selectNum();
}

//deletes latest digit selected
let backOne = () => {
    let text = display.innerHTML;
    for(let i=0;i<text.length;i++){
        if(text[i] === "e"){
            reset();
            return;
        }
    }
    if(numPressed.length === 0 && numStored.length !== 0){
        numStored[0] = display.innerHTML;
    }
    else {
        display.innerHTML = text.substring(0, text.length-1);
        numPressed.pop();
    }
    if(display.innerHTML.length === 0){
        numPressed.push(0);
        display.innerHTML = 0;
    }
}

selectNum();
clear.addEventListener("click", reset);
decimal.addEventListener("click", convertDeci);
backspace.addEventListener("click", backOne);