// === CONFIGURATION ===
const PHASE_1_TOTAL_XP = 1104000;
const PHASE_2_TOTAL_XP = 1354000;
const PHASE_3_TOTAL_XP = 1854000;
const MIN_BP_LEVEL = 1;
const PHASE_1_MAX_BP_LEVEL = 96;
const PHASE_2_MAX_BP_LEVEL = 101;
const PHASE_3_MAX_BP_LEVEL = 106;
const MIN_XP = 0;
const PHASE_2_MAX_XP = 50000;
const PHASE_3_MAX_XP = 100000;
const PHASE_1_BASE_XP = 6000;
const PHASE_1_XP_DELTA = 1000;
const PHASE_1_LEVELS_PER_PAGE = 8;
const PHASE_2_LEVELS_PER_PAGE = 5;
const PHASE_3_LEVELS_PER_PAGE = 5;

const XP_PER_LEVEL = 1000; // Change if needed later

// === Grab DOM Elements ===
const currentLevelInput = document.getElementById("currentLevel");
const currentXpInput = document.getElementById("currentXp");
const goalLevelInput = document.getElementById("goalLevel");

const goalXpBox = document.getElementById("goalXp");
const phase1Results = document.getElementById("phase1Results");
const phase2Results = document.getElementById("phase2Results");
const phase3Results = document.getElementById("phase3Results");

// === Validate Inputs ===
function validateInputs() {
  let valid = true;

  // Validate current level
  if (
    currentLevelInput.value === "" ||
    currentLevelInput.value < MIN_BP_LEVEL ||
    currentLevelInput.value > PHASE_3_MAX_BP_LEVEL
  ) {
    currentLevelInput.classList.add("invalid");
    valid = false;
  } else {
    currentLevelInput.classList.remove("invalid");
  }

  let maxXP = getPhaseMaxXP(currentLevelInput.value);

  // Validate current XP
  if (
    currentXpInput.value === "" ||
    parseInt(currentXpInput.value) < MIN_XP ||
    parseInt(currentXpInput.value) > maxXP
  ) {
    currentXpInput.classList.add("invalid");
    valid = false;
  } else {
    currentXpInput.classList.remove("invalid");
  }

  // Validate goal level
  if (
    goalLevelInput.value === "" ||
    parseInt(goalLevelInput.value) < currentLevelInput.value ||
    parseInt(goalLevelInput.value) > PHASE_3_MAX_BP_LEVEL
  ) {
    goalLevelInput.classList.add("invalid");
    valid = false;
  } else {
    goalLevelInput.classList.remove("invalid");
  }
  return valid;
}

function getPhaseMaxXP(level) {
  if (level > PHASE_2_MAX_BP_LEVEL) {
    return PHASE_3_MAX_XP;
  }
  if (level > PHASE_1_MAX_BP_LEVEL) {
    return PHASE_2_MAX_XP;
  }
  return (
    Math.floor((level - 1) / PHASE_1_LEVELS_PER_PAGE) * PHASE_1_XP_DELTA +
    PHASE_1_BASE_XP
  );
}

// === Calculate XP Needed ===
function calculateXpNeeded(targetLevel) {
  const currentLevel = parseInt(currentLevelInput.value) || MIN_BP_LEVEL;
  const currentXp = parseInt(currentXpInput.value) || MIN_XP;

  let currentTotalXp = calculateTotalXp(currentLevel, currentXp);
  let goalTotalXp = calculateTotalXp(targetLevel);
  return goalTotalXp - currentTotalXp;
}

function calculateTotalXp(currentLevel, currentXp = MIN_XP) {
  const completeLevels = currentLevel - 1;

  if (completeLevels <= PHASE_1_MAX_BP_LEVEL) {
    let currentTotalXp = MIN_XP;
    for (let level = MIN_BP_LEVEL; level < currentLevel; level++) {
      currentTotalXp = currentTotalXp + ((Math.floor((level - 1) / PHASE_1_LEVELS_PER_PAGE)) * PHASE_1_XP_DELTA) + PHASE_1_BASE_XP;
    }
    return parseInt(currentTotalXp + currentXp);
  }
  if (completeLevels <= PHASE_2_MAX_BP_LEVEL) {
    return parseInt(PHASE_1_TOTAL_XP + ((completeLevels - PHASE_1_MAX_BP_LEVEL) * PHASE_2_MAX_XP) + currentXp);
  }
  if (completeLevels <= PHASE_3_MAX_BP_LEVEL) {
    return parseInt(PHASE_2_TOTAL_XP + ((completeLevels - PHASE_2_MAX_BP_LEVEL) * PHASE_3_MAX_XP) + currentXp);
  }
}

function getResultString(xpNeeded) {
  if (parseInt(xpNeeded) < MIN_XP) {
    return "This level is complete";
  } else {
    return xpNeeded.toLocalString();
  }
}

// === Update Display Instantly ===
function updateDisplay() {
  if (!validateInputs()) {
    goalXpBox.textContent = `Total XP for level - at - XP: -`;
    phase1Results.textContent = `Total XP to complete level 96 (1104000 XP): -`;
    phase2Results.textContent = `Total XP to complete level 101 (1354000 XP): -`;
    phase3Results.textContent = `Total XP to complete level 106 (1854000 XP): -`;
    return;
  }

  const goalLevel = parseInt(goalLevelInput.value) || PHASE_3_MAX_BP_LEVEL;
  const goalXpNeeded = calculateXpNeeded(goalLevel + 1);
  const phase1XpNeeded = calculateXpNeeded(PHASE_1_MAX_BP_LEVEL + 1);
  const phase2XpNeeded = calculateXpNeeded(PHASE_2_MAX_BP_LEVEL + 1);
  const phase3XpNeeded = calculateXpNeeded(PHASE_3_MAX_BP_LEVEL + 1);

  goalXpBox.textContent = `XP needed for Goal Level: ${getResultString(goalXpNeeded)}`;
  phase1Results.textContent = `Total XP to complete level 96 (1104000 XP): ${getResultString(phase1XpNeeded)}`;
  phase2Results.textContent = `Total XP to complete level 101 (1354000 XP): ${getResultString(phase2XpNeeded)}`;
  phase3Results.textContent = `Total XP to complete level 106 (1854000 XP): ${getResultString(phase3XpNeeded)}`;
}

// === Event Listeners ===
[currentLevelInput, currentXpInput, goalLevelInput].forEach((input) => {
  input.addEventListener("input", updateDisplay);
});

// === Initial Update ===
updateDisplay();
