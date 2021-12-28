/*
add, subtract, multiply, divide, equals, 
numbers(0-9), clear, decimal, backspace

*/
const gridContainer = document.querySelector(`.grid`);
const numContainer = document.querySelectorAll(`.num`);
const opContainer = document.querySelector(`.op-container`);

console.log(opContainer.children)
//console.log(numContainer);
//console.log(opContainer);

let work = (e) => {
    //click a button
    console.log(e.target);
    let operator = e.target.id;
}

gridContainer.addEventListener("click", work);