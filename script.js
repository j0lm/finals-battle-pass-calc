// === CONFIGURATION ===
const MIN_BP_LEVEL = 1;
const PHASE_1_MAX_BP_LEVEL = 96;
const PHASE_2_MAX_BP_LEVEL = 101;
const PHASE_3_MAX_BP_LEVEL = 106;
const MIN_XP = 0;
const PHASE_2_MAX_XP = 50000;
const PHASE_3_MAX_XP = 75000;
const PHASE_1_BASE_XP = 6000;
const PHASE_1_XP_DELTA = 1000;
const PHASE_1_LEVELS_PER_PAGE = 8;
const PHASE_2_LEVELS_PER_PAGE = 5;
const PHASE_3_LEVELS_PER_PAGE = 5;
const PHASE_1_TOTAL_XP = 1104000;
const PHASE_2_TOTAL_XP = PHASE_1_TOTAL_XP + (PHASE_2_MAX_XP * PHASE_2_LEVELS_PER_PAGE);
const PHASE_3_TOTAL_XP = PHASE_2_TOTAL_XP + (PHASE_3_MAX_XP * PHASE_3_LEVELS_PER_PAGE);

// === Grab DOM Elements ===
const currentLevelInput = document.getElementById("currentLevel");
const currentXpInput = document.getElementById("currentXp");
const goalLevelInput = document.getElementById("goalLevel");

const currentXpMax = document.getElementById("currentXpMax");

const goalXpLeft = document.getElementById("goalXpLeft");
const phase1XpLeft = document.getElementById("phase1XpLeft");
const phase2XpLeft = document.getElementById("phase2XpLeft");
const phase3XpLeft = document.getElementById("phase3XpLeft");

const goalXpProgress = document.getElementById("goalXpProgress");
const phase1XpProgress = document.getElementById("phase1XpProgress");
const phase2XpProgress = document.getElementById("phase2XpProgress");
const phase3XpProgress = document.getElementById("phase3XpProgress");

const goalXpBox = document.getElementById("goalXp");
const phase1Results = document.getElementById("phase1Results");
const phase2Results = document.getElementById("phase2Results");
const phase3Results = document.getElementById("phase3Results");

// === Validate Inputs ===
function validateBPLevel() {
  let valid = true;
  if (
    currentLevelInput.value === "" ||
    parseInt(currentLevelInput.value) < MIN_BP_LEVEL ||
    parseInt(currentLevelInput.value) > PHASE_3_MAX_BP_LEVEL
  ) {
    currentLevelInput.classList.add("invalid");
    valid = false;
  } else {
    currentLevelInput.classList.remove("invalid");
  }
  return valid;
}

function validateCurrentXp() {
  let valid = true;
  let maxXP = getPhaseMaxXP(parseInt(currentLevelInput.value));
  if (
    parseInt(currentXpInput.value) < MIN_XP ||
    parseInt(currentXpInput.value) > maxXP
  ) {
    currentXpInput.classList.add("invalid");
    valid = false;
  } else {
    currentXpInput.classList.remove("invalid");
  }
  return valid;
}

function validateGoalLevel() {
  let valid = true;
  if (
    goalLevelInput.value === "" ||
    parseInt(goalLevelInput.value) < MIN_BP_LEVEL ||
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
function calculateXpNeeded(xp, targetLevel) {
  let goalTotalXp = calculateTotalXp(targetLevel);
  return goalTotalXp - xp;
}

function calculateTotalXp(currentLevel, currentXp = MIN_XP) {
  const completeLevels = currentLevel - 1;
  if (currentXp === "") {
    currentXp = 0;
  } else {
    currentXp = parseInt(currentXpInput.value)
  }
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
    return `This level is complete`;
  } else {
    return xpNeeded.toLocaleString();
  }
}

function getXpLeftString(xpNeeded) {
  if (parseInt(xpNeeded) < MIN_XP) {
    return "COMPLETE"
  } else {
    return `${xpNeeded.toLocaleString()} XP LEFT`;
  }
}

function getXpProgressString(xp) {
  return `${xp}/${getPhaseMaxXP(parseInt(currentLevelInput.value))}`
}

// === Update Display Instantly ===
function updateDisplay() {
  let isCurrentLevelValid = validateBPLevel();
  let isCurrentXpValid = validateCurrentXp();
  let isCurrentGoalValid = validateGoalLevel();

  if (isCurrentLevelValid && isCurrentXpValid) {
    let currentTotalXp = calculateTotalXp(parseInt(currentLevelInput.value), currentXpInput.value);
    if (isCurrentGoalValid) {
      goalXpNeeded = calculateXpNeeded(currentTotalXp, goalLevelInput.value);
      goalXpNeeded.textContent = getXpLeftString(goalXpNeeded);
      goalXpProgress.textContent = getXpProgressString(goalXpNeeded);
    } else {
      goalXpLeft.textContent = `INVALID GOAL LEVEL`;
      goalXpProgress.textContent = `-/-`
    }
    
    let phase1XpNeeded = calculateXpNeeded(currentTotalXp, PHASE_1_MAX_BP_LEVEL + 1);
    let phase2XpNeeded = calculateXpNeeded(currentTotalXp, PHASE_2_MAX_BP_LEVEL + 1);
    let phase3XpNeeded = calculateXpNeeded(currentTotalXp, PHASE_3_MAX_BP_LEVEL + 1);

    phase1XpLeft.textContent = getXpLeftString(phase1XpNeeded);
    phase2XpLeft.textContent = getXpLeftString(phase2XpNeeded);
    phase3XpLeft.textContent = getXpLeftString(phase3XpNeeded);

    phase1XpProgress.textContent = getXpProgressString(currentTotalXp);
    phase2XpProgress.textContent = getXpProgressString(currentTotalXp);
    phase3XpProgress.textContent = getXpProgressString(currentTotalXp);
    
    currentXpMax.textContent = `/${getPhaseMaxXP(parseInt(currentLevelInput.value))}`
    return;
  } else {
    goalXpLeft.textContent = `INVALID LEVEL`
    phase1XpLeft.textContent = `INVALID LEVEL`
    phase2XpLeft.textContent = `INVALID LEVEL`
    phase3XpLeft.textContent = `INVALID LEVEL`
    goalXpProgress.textContent = `-/-`
    phase1XpProgress.textContent = `-/-`
    phase2XpProgress.textContent = `-/-`
    phase3XpProgress.textContent = `-/-`
    currentXpMax.textContent = `-`
    return;
  }
}

// === Event Listeners ===
[currentLevelInput, currentXpInput, goalLevelInput].forEach((input) => {
  input.addEventListener("input", updateDisplay);
});

// === Initial Update ===
updateDisplay();
