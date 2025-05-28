const cabins = [
  [
    { cabin: 1, spots: [1, 2, 3, 4, 5, 6], names: [] },
    { cabin: 2, spots: [1, 2, 3, 4, 5, 6], names: [] },
    { cabin: 3, spots: [1, 2, 3, 4, 5, 6], names: [] }
  ],
  [
    { cabin: 1, spots: [1, 2, 3, 4, 5, 6], names: [] },
    { cabin: 2, spots: [1, 2, 3, 4, 5, 6], names: [] },
    { cabin: 3, spots: [1, 2, 3, 4, 5, 6], names: [] }
  ],
  [
    { cabin: 1, spots: [1, 2, 3, 4, 5, 6], names: [] },
    { cabin: 2, spots: [1, 2, 3, 4, 5, 6], names: [] },
    { cabin: 3, spots: [1, 2, 3, 4, 5, 6], names: [] }
  ]
];
const namesListUl = document.getElementById('stored-names-list');

let cabinSetIndex = 0; // Track which set of cabins to fill
let clickCount = 0; // Track number of clicks
let checkboxChecked = false;
displayStoredNamesList();
let initialized = false;

function storeName() {
  const nameInput = document.getElementById("name").value.trim();
  let storedNames = JSON.parse(localStorage.getItem('storedNames')) || [];

  if (nameInput !== "") {
    storedNames.push(nameInput);
    localStorage.setItem('storedNames', JSON.stringify(storedNames));
    document.getElementById("name").value = "";

    displayStoredNamesList();

    document.getElementById("name").focus();
  }
}


function setCabinSpots() {
  const cabin1Spots = parseInt(document.getElementById("cabin1-spots").value, 10);
  const cabin2Spots = parseInt(document.getElementById("cabin2-spots").value, 10);
  const cabin3Spots = parseInt(document.getElementById("cabin3-spots").value, 10);
  
  if (!cabin1Spots || !cabin2Spots || !cabin3Spots) {
    alert("Please enter valid spots for all three cabins.");
    return;
  }
  
  // Reset all cabin sets with new spots
  cabins.forEach(set => {
    set[0].spots = Array.from({ length: cabin1Spots }, (_, i) => i + 1);
    set[1].spots = Array.from({ length: cabin2Spots }, (_, i) => i + 1);
    set[2].spots = Array.from({ length: cabin3Spots }, (_, i) => i + 1);
    set.forEach(cabin => cabin.names = []);
  });
  
  initialized = true;
  cabinSetIndex = 0;
  clickCount = 0;
  alert("Cabin spots updated. Cycle will restart.");
  displayCabins(); 
}
// Handling checkbox change
document.addEventListener("DOMContentLoaded", function() {
  const checkbox = document.getElementById("checkbox");
  if (checkbox) {
    checkbox.addEventListener("change", function() {
      checkboxChecked = checkbox.checked;
    });
  }
});

function assignAndDisplayNames() {
  let storedNames = JSON.parse(localStorage.getItem('storedNames')) || [];
  if (storedNames.length === 0) {
    alert("No names stored! Please store names first.");
    return;
  }

  const totalSpots = cabins[cabinSetIndex].reduce((acc, cabin) => acc + cabin.spots.length, 0);

  if (storedNames.length < totalSpots) {
    alert("Not enough names stored! Please store more names.");
    return;
  }

  let shuffledNames = [...storedNames];

  function getRandomName(cabinIdx, setIdx) {
    if(checkboxChecked){
      let availableNames = shuffledNames.filter(name => !previousCabinCheck(name, cabinIdx, setIdx));
    if (availableNames.length === 0) {
      availableNames = [...shuffledNames];
    }

    const randomIndex = Math.floor(Math.random() * availableNames.length);
    const randomName = availableNames[randomIndex];
    shuffledNames.splice(shuffledNames.indexOf(randomName), 1);
    return randomName;
    }
   else{
    const randomIndex = Math.floor(Math.random() * shuffledNames.length);
    const randomName = shuffledNames[randomIndex];
    shuffledNames.splice(randomIndex, 1);
    return randomName;
   }
  }
  if (clickCount < 3) {
    cabins[clickCount].forEach((cabin, cabinIdx) => {
      cabin.names = [];
      for (let i = 0; i < cabin.spots.length; i++) {
        if (checkboxChecked) {
          cabin.names.push(getRandomName(cabinIdx, clickCount));
        } else {
          cabin.names.push(getRandomName());
        }
      }
    });
  } else {
    cabins[0] = JSON.parse(JSON.stringify(cabins[1]));
    cabins[1] = JSON.parse(JSON.stringify(cabins[2]));

    let set3Names = [...cabins[2].flatMap(cabin => cabin.names)];

    for (let i = 0; i < set3Names.length; i++) {
      let cabinIdx = Math.floor(i / 6);
      set3Names[i] = checkboxChecked
        ? getRandomName(cabinIdx, clickCount)
        : getRandomName();
    }

    let nameIndex = 0;
    cabins[2].forEach(cabin => {
      cabin.names = [];
      for (let i = 0; i < cabin.spots.length; i++) {
        cabin.names.push(set3Names[nameIndex] || '');
        nameIndex++;
      }
    });
  }

  clickCount++;
  displayCabins();
}

function previousCabinCheck(name, cabinIdx, excludeSetIdx) {
  return cabins.some((set, idx) => idx !== excludeSetIdx && set[cabinIdx].names.includes(name));
}

function displayCabins() {
  const cabinsContainer = document.getElementById('cabins');
  cabinsContainer.innerHTML = '';

  cabins.forEach((cabinSet, setIndex) => {
    const setDiv = document.createElement('div');
    setDiv.classList.add('cabin-set');
    setDiv.innerHTML = `<h1>Cabin Set ${setIndex + 1}</h1>`;
    
    cabinSet.forEach(cabin => {
      const cabinDiv = document.createElement('div');
      cabinDiv.classList.add('cabin');
      cabinDiv.innerHTML = `<h4>Cabin ${cabin.cabin}</h4>`;
  
      cabin.spots.forEach((spot, i) => {
        const spotDiv = document.createElement('div');
        spotDiv.classList.add('spot');
        spotDiv.innerHTML = `${spot} : ${cabin.names[i] || ''}`; 
        cabinDiv.appendChild(spotDiv);
      });
  
      setDiv.appendChild(cabinDiv);
    });
    
    cabinsContainer.appendChild(setDiv);
  });
}

function displayStoredNamesList() {
  const storedNames = JSON.parse(localStorage.getItem('storedNames')) || [];
  namesListUl.innerHTML = "Stored Names:";
  
  storedNames.forEach((name,index) => {
    const nameSpan = document.createElement("li");
    nameSpan.textContent = name;
    namesListUl.appendChild(nameSpan);

    const newbtn = document.createElement("button");
    newbtn.innerHTML = "\u00d7";
    newbtn.classList.add("newbtn");

    newbtn.addEventListener("click", () => {
      storedNames.splice(index, 1);
      localStorage.setItem('storedNames', JSON.stringify(storedNames));
      displayStoredNamesList();
    });

    namesListUl.appendChild(newbtn);
  });
}
