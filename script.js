// === CONFIGURATION ===
const XP_PER_LEVEL = 1000; // Change if needed later

// === Grab DOM Elements ===
const currentLevelInput = document.getElementById("currentLevel");
const currentXpInput = document.getElementById("currentXp");
const goalLevelInput = document.getElementById("goalLevel");

const goalXpBox = document.getElementById("goalXp");
const lvl96Box = document.getElementById("lvl96");
const lvl101Box = document.getElementById("lvl101");
const lvl106Box = document.getElementById("lvl106");

// === Validate Inputs ===
function validateInputs() {
  let valid = true;

  // Validate current level
  if (
    currentLevelInput.value === "" ||
    currentLevelInput.value < 1 ||
    currentLevelInput.value > 106
  ) {
    currentLevelInput.classList.add("invalid");
    valid = false;
  } else {
    currentLevelInput.classList.remove("invalid");
  }

  // Validate current XP
  if (
    currentXpInput.value === "" ||
    currentXpInput.value < 0 ||
    currentXpInput.value > XP_PER_LEVEL
  ) {
    currentXpInput.classList.add("invalid");
    valid = false;
  } else {
    currentXpInput.classList.remove("invalid");
  }

  // Validate goal level
  if (
    goalLevelInput.value === "" ||
    goalLevelInput.value < 1 ||
    goalLevelInput.value > 106
  ) {
    goalLevelInput.classList.add("invalid");
    valid = false;
  } else {
    goalLevelInput.classList.remove("invalid");
  }

  return valid;
}

// === Calculate XP Needed ===
function calculateXpNeeded(targetLevel) {
  const currentLevel = parseInt(currentLevelInput.value) || 0;
  const currentXp = parseInt(currentXpInput.value) || 0;

  let totalXpNeeded = 0;

  if (targetLevel > currentLevel) {
    const levelsRemaining = targetLevel - currentLevel - 1;
    totalXpNeeded = (levelsRemaining * XP_PER_LEVEL) + (XP_PER_LEVEL - currentXp);
  } else if (targetLevel === currentLevel) {
    totalXpNeeded = XP_PER_LEVEL - currentXp;
  } else {
    totalXpNeeded = 0;
  }

  return Math.max(0, totalXpNeeded);
}

// === Update Display Instantly ===
function updateDisplay() {
  if (!validateInputs()) {
    goalXpBox.textContent = `XP needed for Goal Level: -`;
    lvl96Box.textContent = `XP needed for Level 96: -`;
    lvl101Box.textContent = `XP needed for Level 101: -`;
    lvl106Box.textContent = `XP needed for Level 106: -`;
    return;
  }

  const goalLevel = parseInt(goalLevelInput.value) || 106;

  goalXpBox.textContent = `XP needed for Goal Level: ${calculateXpNeeded(goalLevel).toLocaleString()}`;
  lvl96Box.textContent = `XP needed for Level 96: ${calculateXpNeeded(96).toLocaleString()}`;
  lvl101Box.textContent = `XP needed for Level 101: ${calculateXpNeeded(101).toLocaleString()}`;
  lvl106Box.textContent = `XP needed for Level 106: ${calculateXpNeeded(106).toLocaleString()}`;
}

// === Event Listeners ===
[currentLevelInput, currentXpInput, goalLevelInput].forEach(input => {
  input.addEventListener("input", updateDisplay);
});

// === Initial Update ===
updateDisplay();
