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

const xpBarFill = document.getElementById("xpFill");
const goalBarFill = document.getElementById("goalFill");
const phase1BarFill = document.getElementById("phase1Fill");
const phase2BarFill = document.getElementById("phase2Fill");
const phase3BarFill = document.getElementById("phase3Fill");



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

function centerCurrentXpText() {
  const container = document.querySelector('.current-xp-text');
  const input = document.getElementById('currentXp');
  const label = document.getElementById('currentXpMax');
  let valueStr = currentXpInput.textContent.replace(/,/g, "");
  const formatted = Number(valueStr || 0).toLocaleString()
  // Measure combined width of input + label
  const inputWidth = input.offsetWidth;
  const labelWidth = label.offsetWidth;
  const totalWidth = inputWidth + labelWidth;

  // Shift container so combined block is centered
  container.style.transform = `translateX(-${totalWidth}px) translateY(-50%)`;
}

function validateCurrentXp() {
  let valid = true;

  const selection = window.getSelection();
  const caretOffset = selection.focusOffset;

  // Remove commas and get the numeric value
  let valueStr = currentXpInput.textContent.replace(/,/g, "");
  let value = parseInt(valueStr);

  const maxXp = getPhaseMaxXp(parseInt(currentLevelInput.value));

  // Check if empty or not a number
  if (!/^\d*$/.test(valueStr) || value < 0 || value > maxXp) {
    valid = false;
    currentXpInput.classList.add("invalid");
  } else {
    valid = true;
    currentXpInput.classList.remove("invalid");
  }

  // Only format if it's a number
  if (/^\d*$/.test(valueStr)) {
    const formatted = Number(valueStr || 0).toLocaleString();
    currentXpInput.textContent = formatted;

    // Restore caret position
    const newOffset = Math.min(caretOffset + (formatted.length - valueStr.length), formatted.length);
    const range = document.createRange();
    range.setStart(currentXpInput.firstChild || currentXpInput, newOffset);
    range.collapse(true);
    selection.removeAllRanges();
    selection.addRange(range);
  }
  centerCurrentXpText();
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

function getPhaseMaxXp(level) {
  if (level > PHASE_2_MAX_BP_LEVEL) {
    return PHASE_3_MAX_XP;
  }
  if (level > PHASE_1_MAX_BP_LEVEL) {
    return PHASE_2_MAX_XP;
  }
  return (
    (Math.floor((level - 1) / PHASE_1_LEVELS_PER_PAGE)) * PHASE_1_XP_DELTA + PHASE_1_BASE_XP
  );
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

function getXpLeftString(xpNeeded) {
  if (xpNeeded <= MIN_XP) {
    return "COMPLETE"
  } else {
    return `${xpNeeded.toLocaleString()} XP LEFT`;
  }
}

function getXpProgressString(currentTotalXp, targetLevel) {
  let targetTotalXp = calculateTotalXp(targetLevel);
  let currentXp = currentTotalXp > targetTotalXp ? targetTotalXp : currentTotalXp;
  return `${currentXp.toLocaleString()}/${targetTotalXp.toLocaleString()}`
}

function getBarProgress(currentValue, maxValue) {
  let percent = (currentValue / maxValue) * 100;
  if (percent < 0) percent = 0;
  if (percent > 100) percent = 100;
  return percent + "%";
}

// === Update Display Instantly ===
function updateDisplay() {
  let isCurrentLevelValid = validateBPLevel();
  let isCurrentXpValid = validateCurrentXp();
  let isCurrentGoalValid = validateGoalLevel();

  if (isCurrentLevelValid) {
    let currentLevel = parseInt(currentLevelInput.value);
    let currentXp = 0
    if (isCurrentXpValid) {
      currentXp = parseInt(currentXpInput.textContent.replace(/,/g, ""))
    }
    let currentTotalXp = calculateTotalXp(currentLevel, currentXp);
    if (isCurrentGoalValid) {
      let currentGoal = parseInt(goalLevelInput.value);
      let goalTotalXp = calculateTotalXp(currentGoal + 1)
      goalXpNeeded = goalTotalXp - currentTotalXp;
      goalXpLeft.textContent = getXpLeftString(goalXpNeeded);
      goalXpProgress.textContent = getXpProgressString(currentTotalXp, currentGoal + 1);
      goalBarFill.style.width = getBarProgress(currentTotalXp, goalTotalXp);
    } else {
      goalXpLeft.textContent = `INVALID GOAL LEVEL`;
      goalXpProgress.textContent = `?/?`
    }
    
    let phase1XpNeeded = PHASE_1_TOTAL_XP - currentTotalXp;
    let phase2XpNeeded = PHASE_2_TOTAL_XP - currentTotalXp;
    let phase3XpNeeded = PHASE_3_TOTAL_XP - currentTotalXp;

    phase1XpLeft.textContent = getXpLeftString(phase1XpNeeded);
    phase2XpLeft.textContent = getXpLeftString(phase2XpNeeded);
    phase3XpLeft.textContent = getXpLeftString(phase3XpNeeded);

    phase1XpProgress.textContent = getXpProgressString(currentTotalXp, PHASE_1_MAX_BP_LEVEL + 1);
    phase2XpProgress.textContent = getXpProgressString(currentTotalXp, PHASE_2_MAX_BP_LEVEL + 1);
    phase3XpProgress.textContent = getXpProgressString(currentTotalXp, PHASE_3_MAX_BP_LEVEL + 1);

    phase1BarFill.style.width = getBarProgress(currentTotalXp, PHASE_1_TOTAL_XP);
    phase2BarFill.style.width = getBarProgress(currentTotalXp, PHASE_2_TOTAL_XP);
    phase3BarFill.style.width = getBarProgress(currentTotalXp, PHASE_3_TOTAL_XP);

    let phaseMaxXp = getPhaseMaxXp(currentLevel)
    currentXpMax.textContent = `/${phaseMaxXp.toLocaleString()} XP`
    xpBarFill.style.width = getBarProgress(currentXp, phaseMaxXp);

    return;
  } else {
    let currentLevel = parseInt(currentLevelInput.value);
    goalXpLeft.textContent = `INVALID LEVEL`;
    phase1XpLeft.textContent = `INVALID LEVEL`;
    phase2XpLeft.textContent = `INVALID LEVEL`;
    phase3XpLeft.textContent = `INVALID LEVEL`;
    goalXpProgress.textContent = `?/?`;
    phase1XpProgress.textContent = `?/?`;
    phase2XpProgress.textContent = `?/?`;
    phase3XpProgress.textContent = `?/?`;
    currentXpMax.textContent = isCurrentLevelValid ? `/${getPhaseMaxXp(currentLevel).toLocaleString()} XP` : `/? XP`;
    xpBarFill.style.width = `0%`;
    phase1BarFill.style.width = `0%`;
    phase2BarFill.style.width = `0%`;
    phase3BarFill.style.width = `0%`;
    return;
  }
}

// === Event Listeners ===
[currentLevelInput, currentXpInput, goalLevelInput].forEach((input) => {
  input.addEventListener("input", updateDisplay);
});

// === Initial Update ===
updateDisplay();
