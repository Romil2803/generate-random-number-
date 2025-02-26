let textContainer = document.getElementById("textContainer");
let result = document.getElementById("result");
let addButton = document.getElementById("addButton");
let submitButton = document.getElementById("submitButton");
let texts=[];
let availableNumbers = [];

addButton.addEventListener("click", function() {
    let newText = document.getElementById("newInput").value;
    if (!newText) {
        alert("Enter your Name");
        return;
    }
    let p = document.createElement("p");
    p.innerText = newText;
    textContainer.appendChild(p);
    texts.push(newText);
    submitButton.style.display = "inline";
    document.getElementById("newInput").value = "";
});

submitButton.addEventListener("click", function() {
   
    for (let i = 1; i <= texts.length; i++) {
        availableNumbers.push(i);
    }
    availableNumbers = availableNumbers.sort(() => Math.random() - 0.5);
    texts.forEach((text, index) => {
        let assignedNumber = availableNumbers[index];
        let p = document.createElement("p");
        p.innerText = `${text} - Assigned number: ${assignedNumber}`;
        result.appendChild(p);
    });
    texts = [];
    textContainer.innerHTML = ""; 
    submitButton.style.display = "none"; 
});
