function getStoredNamesCount() {
  const storedNames = JSON.parse(localStorage.getItem('storedNames')) || [];
  return storedNames.length;
}
const cabins = [
  [
    { cabin: 1, spots: [1, 2, 3, 4, 5], names: [] },
    { cabin: 2, spots: [1, 2, 3, 4, 5, 6], names: [] },
    { cabin: 3, spots: [1, 2, 3, 4, 5, 6], names: [] },
    { cabin: 4, spots: [1, 2, 3, 4, 5, 6], names: [] }
  ],
  [
    { cabin: 1, spots: [1, 2, 3, 4, 5], names: [] },
    { cabin: 2, spots: [1, 2, 3, 4, 5, 6], names: [] },
    { cabin: 3, spots: [1, 2, 3, 4, 5, 6], names: [] },
    { cabin: 4, spots: [1, 2, 3, 4, 5, 6], names: [] }
  ],
  [
    { cabin: 1, spots: [1, 2, 3, 4, 5], names: [] },
    { cabin: 2, spots: [1, 2, 3, 4, 5, 6], names: [] },
    { cabin: 3, spots: [1, 2, 3, 4, 5, 6], names: [] },
    { cabin: 4, spots: [1, 2, 3, 4, 5, 6], names: [] }
  ],

];
const namesListUl = document.getElementById('stored-names-list');

let cabinSetIndex = 0;
let clickCount = 0;
let checkboxChecked = false;
displayStoredNamesList();
let initialized = false;


document.addEventListener('DOMContentLoaded', function() {

  document.documentElement.classList.add('dark');
  localStorage.setItem('theme', 'dark');

  const themeToggle = document.getElementById('theme-toggle');
  themeToggle.addEventListener('click', () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    updateThemeIcon();
  });

  function updateThemeIcon() {
    const isDark = document.documentElement.classList.contains('dark');
    document.getElementById('theme-icon-dark').classList.toggle('hidden', !isDark);
    document.getElementById('theme-icon-light').classList.toggle('hidden', isDark);
  }

  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark');
  }
  updateThemeIcon();

  document.getElementById('name').focus();
});




function storeName() {
  const nameInput = document.getElementById("name").value.trim();
  let storedNames = JSON.parse(localStorage.getItem('storedNames')) || [];

  if (nameInput !== "") {
    storedNames.push(nameInput);
    localStorage.setItem('storedNames', JSON.stringify(storedNames));
    document.getElementById("name").value = "";
    displayStoredNamesList();
    document.getElementById("name").focus();

    // Update count in UI
    document.querySelector('#stored-names-container h3').textContent =
        `Employees List (${getStoredNamesCount()})`;
  }
}


function setCabinSpots() {
  const cabin1Spots = parseInt(document.getElementById("cabin1-spots").value, 5);
  const cabin2Spots = parseInt(document.getElementById("cabin2-spots").value, 10);
  const cabin3Spots = parseInt(document.getElementById("cabin3-spots").value, 10);
  const cabin4Spots = parseInt(document.getElementById("cabin4-spots").value, 10);

  if (!cabin1Spots || !cabin2Spots || !cabin3Spots|| !cabin4Spots) {
    alert("Please enter valid spots for all three cabins.");
    return;
  }

  cabins.forEach(set => {
    set[0].spots = Array.from({ length: cabin1Spots }, (_, i) => i + 1);
    set[1].spots = Array.from({ length: cabin2Spots }, (_, i) => i + 1);
    set[2].spots = Array.from({ length: cabin3Spots }, (_, i) => i + 1);
    set[3].spots = Array.from({ length: cabin4Spots }, (_, i) => i + 1);
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
    setDiv.innerHTML = `
      <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
        <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-light dark:bg-primary-dark text-white text-sm mr-2">${setIndex + 1}</span>
        Set ${setIndex + 1}
      </h2>
      <div class="grid grid-cols-1 gap-4"></div>
    `;

    const cabinsGrid = setDiv.querySelector('div');

    cabinSet.forEach(cabin => {
      const cabinDiv = document.createElement('div');
      cabinDiv.classList.add('cabin');
      cabinDiv.innerHTML = `
       <h4 class="flex items-center text-gray-800 dark:text-indigo-200">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-gray-700 dark:text-indigo-300" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clip-rule="evenodd" />
    </svg>
    Cabin ${cabin.cabin}
</h4>
        <div class="space-y-2 mt-3"></div>
      `;

      const spotsContainer = cabinDiv.querySelector('div');

      cabin.spots.forEach((spot, i) => {
        const spotDiv = document.createElement('div');
        spotDiv.classList.add('spot');
        if (cabin.names[i]) {
          spotDiv.classList.add('highlight');
        }
        spotDiv.innerHTML = `
    <span class="font-medium text-gray-700 dark:text-gray-300">${spot}:</span> 
    <span class="${cabin.names[i] ? 'text-gray-800 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}">
        ${cabin.names[i] || '—'}
    </span>
`;
        spotsContainer.appendChild(spotDiv);
      });

      cabinsGrid.appendChild(cabinDiv);
    });

    cabinsContainer.appendChild(setDiv);
  });
}

function displayStoredNamesList() {
  const storedNames = JSON.parse(localStorage.getItem('storedNames')) || [];
  namesListUl.innerHTML = '';

  storedNames.forEach((name, index) => {
    const listItem = document.createElement("li");
    listItem.textContent = name;
    listItem.className = 'flex items-center';

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "×";
    deleteBtn.className = "newbtn ml-1";

    deleteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      storedNames.splice(index, 1);
      localStorage.setItem('storedNames', JSON.stringify(storedNames));
      displayStoredNamesList();
      document.querySelector('#stored-names-container h3').textContent =
          `Employees List (${getStoredNamesCount()})`;
    });

    listItem.appendChild(deleteBtn);
    namesListUl.appendChild(listItem);
  });

  document.querySelector('#stored-names-container h3').textContent =
      `Employees List (${getStoredNamesCount()})`;
}
