const cabins = [
  { cabin: 1, spots: [1, 2, 3, 4, 5, 6], names: [] },
  { cabin: 2, spots: [1, 2, 3, 4, 5, 6], names: [] },
  { cabin: 3, spots: [1, 2, 3, 4, 5, 6], names: [] }
];

function storeName() {
  const nameInput = document.getElementById("name").value.trim();

  let storedNames = JSON.parse(localStorage.getItem('storedNames')) || [];

  if (nameInput !== "") {
    storedNames.push(nameInput);
    localStorage.setItem('storedNames', JSON.stringify(storedNames));
    document.getElementById("name").value = ""; 
    displayStoredNames(); 
  }
}

function setCabinSpots(cabinNumber) {
  const spotsInput = parseInt(document.getElementById(`cabin${cabinNumber}-spots`).value, 10);
  const cabin = cabins[cabinNumber - 1];

  if (spotsInput > cabin.spots.length) {
    for (let i = cabin.spots.length + 1; i <= spotsInput; i++) {
      cabin.spots.push(i);
    }
  } else if (spotsInput < cabin.spots.length) {
    cabin.spots = cabin.spots.slice(0, spotsInput); 
    cabin.names = cabin.names.slice(0, spotsInput);
  }
  displayCabins(); 
}

function assignAndDisplayNames() {
  const cabin1Val = parseInt(document.getElementById("cabin1-spots").value, 10) || 0;
  const cabin2Val = parseInt(document.getElementById("cabin2-spots").value, 10) || 0;
  const cabin3Val = parseInt(document.getElementById("cabin3-spots").value, 10) || 0;

  const totalVal = cabin1Val + cabin2Val + cabin3Val;

  if (totalVal === 0) {
    alert("Please enter the number of spots for each cabin.");
    return;
  }

  const names = JSON.parse(localStorage.getItem('storedNames'));
  if (!names || names.length === 0) {
    alert("No names stored! Please store names first.");
    return;
  }

  if (names.length < totalVal) {
    alert("Not enough names stored! Please store more names.");
    return;
  }

  const shuffledNames = [...names];
  for (let i = shuffledNames.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
  }

  let nameIndex = 0;

  cabins.forEach(cabin => {
    cabin.names = [];
    for (let i = 0; i < cabin.spots.length && nameIndex < shuffledNames.length; i++) {
      cabin.names.push(shuffledNames[nameIndex]);
      nameIndex++;
    }
  });
  
  displayCabins();
  // rotateNames();

}

// function rotateNames() {
//   const firstCabinNames = cabins[0].names.slice(); 
//   const secondCabinNames = cabins[1].names.slice(); 
//   const thirdCabinNames = cabins[2].names.slice();

//   // cabins[0].names = secondCabinNames;
//   // cabins[1].names = thirdCabinNames;
//   // cabins[2].names = firstCabinNames;
// }

function displayCabins() {
  const cabinsContainer = document.getElementById('cabins');
  cabinsContainer.innerHTML = '';

  cabins.forEach(cabin => {
    const cabinDiv = document.createElement('div');
    cabinDiv.classList.add('cabin');
    cabinDiv.innerHTML = `Cabin ${cabin.cabin}`; 

    cabin.spots.forEach((spot, index) => {
      const spotDiv = document.createElement('div');
      spotDiv.classList.add('spot');
      spotDiv.innerHTML = `${spot}: ${cabin.names[index] || ''}`; 
      cabinDiv.appendChild(spotDiv);
    });

    cabinsContainer.appendChild(cabinDiv);
  });
}

function displayStoredNames() {
  const namesContainer = document.getElementById('stored-names');
  const storedNames = JSON.parse(localStorage.getItem('storedNames')) || [];

  namesContainer.innerHTML = ''; 

  storedNames.forEach(name => {
    const nameDiv = document.createElement('div');
    nameDiv.classList.add('name');
    nameDiv.innerHTML = name;
    namesContainer.appendChild(nameDiv);
  });
}