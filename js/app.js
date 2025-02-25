const assignedNumbers = {};
let availableNumbers =[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18];


function assignNumber() {
    let name = document.getElementById("nameInput").value;
    let result = document.getElementById("result");
    let createEle=document.createElement("p");

    if (!name) {
        createEle.innerText = "Please enter a name.";
        result.appendChild(createEle);
        return;
    }

    if (assignedNumbers[name]) {
        createEle.innerText = `${name}, your number is ${assignedNumbers[name]}.`;
        result.appendChild(createEle);
        return;
    }

    if (availableNumbers.length === 0) {
        createEle.innerText = "All numbers have been assigned!";
        result.appendChild(createEle);
        return;
    }

    
    let randomIndex = Math.floor(Math.random() * availableNumbers.length);
    let assignedNumber = availableNumbers.splice(randomIndex, 1)[0]; 

    assignedNumbers[name] = assignedNumber;
    name.value = "";
console.log(name.value);

}