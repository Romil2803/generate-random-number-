let availableNumbers =[];
const assignedNumbers = {};

document.getElementById("generateNameInput").addEventListener("click", function() {
    let numberInput = document.getElementById("numberInput").value;
    let result = document.getElementById("result");

   result.innerHTML="";

   if (!numberInput) {
    alert("Enter number");
    return;
   }
   for(let i=1;i<=numberInput;i++){
    availableNumbers.push(i);
   }
   document.getElementById("numberInput").disabled = true;
   document.getElementById("generateNameInput").disabled = true;

   let nameInputContainer = document.getElementById("nameInputContainer");
   let nameInput = document.createElement("input");
   let nameBtn = document.createElement("button");
   nameInput.placeholder="Enter Name";
   nameInput.setAttribute("id","nameInput");
   nameBtn.innerHTML="assignNumber";
   nameBtn.setAttribute("id","assignNum");
   nameInputContainer.appendChild(nameInput);
   nameInputContainer.appendChild(nameBtn);

   document.getElementById("assignNum").addEventListener("click",assignNumber);
});
function assignNumber(){
    let name = document.getElementById("nameInput").value;
    let result = document.getElementById("result");
    let createEle = document.createElement("p");

    if(!name){
        createEle.innerText="Enter Name;";
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

    createEle.innerText = `${name}, your number is ${assignedNumber}.`;
    result.appendChild(createEle);

    document.getElementById("nameInput").value = "";
}


