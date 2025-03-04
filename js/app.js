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
displayStoredNamesList();

let cabinSetIndex = 0; // Track which set of cabins to fill
let clickCount = 0; // Track number of clicks
let initialized = false;

function storeName() {
  const nameInput = document.getElementById("name").value.trim();
  let storedNames = JSON.parse(localStorage.getItem('storedNames')) || [];
  if (nameInput !== "") {
    storedNames.push(nameInput);
    localStorage.setItem('storedNames', JSON.stringify(storedNames));
    document.getElementById("name").value = "";  
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
}


function assignAndDisplayNames(){
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

  // Shuffle names for randomness
  const shuffledNames = [...storedNames];
  for (let i = shuffledNames.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledNames[i], shuffledNames[j]] = [shuffledNames[j], shuffledNames[i]];
  }

  let nameIndex = 0;
  
  if (clickCount < 3) {
    // First three clicks: Just fill one set per click
    cabins[clickCount].forEach(cabin => {
      cabin.names = [];
      for (let i = 0; i < cabin.spots.length; i++) {
        cabin.names.push(shuffledNames[nameIndex]);
        nameIndex++;
      }
    });
  } else {
    // Fourth click and beyond: Rotate sets and reshuffle Set 3
    cabins[0] = JSON.parse(JSON.stringify(cabins[1]));
    cabins[1] = JSON.parse(JSON.stringify(cabins[2]));
    
    // Shuffle names within Set 3 without clearing
    let set3Names = [...cabins[2].flatMap(cabin => cabin.names)];
    for (let i = set3Names.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [set3Names[i], set3Names[j]] = [set3Names[j], set3Names[i]];
    }

    nameIndex = 0;
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
  rotateNames();
}
function rotateNames() {
  const firstCabinNames = cabins[0].flatMap(cabin => cabin.names).slice(); 
  const secondCabinNames = cabins[1].flatMap(cabin => cabin.names).slice(); 
  const thirdCabinNames = cabins[2].flatMap(cabin => cabin.names).slice();

  cabins[0].names = secondCabinNames;
  cabins[1].names = thirdCabinNames;
  cabins[2].names = firstCabinNames;

  // console.log(cabins[0]);
  // console.log(cabins[1]);
  // console.log(cabins[2]);
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
