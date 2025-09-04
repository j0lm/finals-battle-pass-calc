#!/usr/bin/python3

# constants
PHASE_1_TOTAL_XP = 1104000
PHASE_2_TOTAL_XP = 1354000
PHASE_3_TOTAL_XP = 1854000
MIN_BP_LEVEL = 1
PHASE_1_MAX_BP_LEVEL = 96
PHASE_2_MAX_BP_LEVEL = 101
PHASE_3_MAX_BP_LEVEL = 106
MIN_XP = 0
PHASE_2_MAX_XP = 50000
PHASE_3_MAX_XP = 100000
PHASE_1_BASE_XP = 6000
PHASE_1_XP_DELTA = 1000
PHASE_1_LEVELS_PER_PAGE = 8
PHASE_2_LEVELS_PER_PAGE = 5
PHASE_3_LEVELS_PER_PAGE = 5


def validate_xp_value(xp, current_level):
    if not xp.isdigit():
        return False
    xp = int(xp)
    upper_limit = 0
    if current_level >= PHASE_2_MAX_BP_LEVEL:
        upper_limit = PHASE_3_MAX_XP
    elif current_level >= PHASE_1_MAX_BP_LEVEL:
        upper_limit = PHASE_2_MAX_XP
    else:
        upper_limit = PHASE_1_BASE_XP + (int(current_level / PHASE_1_LEVELS_PER_PAGE) * PHASE_1_XP_DELTA)
    return (xp >= MIN_XP and xp <= upper_limit)


def validate_level_value(level, current_level=None):
    if not level.isdigit():
        return False
    if int(level) < MIN_BP_LEVEL or int(level) > PHASE_3_MAX_BP_LEVEL:
        return False
    if current_level is not None and int(level) < current_level:
        return False
    return True


def get_phase_max_xp(level):
    if level > PHASE_2_MAX_BP_LEVEL:
        return PHASE_3_MAX_XP
    if level > PHASE_1_MAX_BP_LEVEL:
        return PHASE_2_MAX_XP
    return (int((level - 1) / PHASE_1_LEVELS_PER_PAGE) * PHASE_1_XP_DELTA) + PHASE_1_BASE_XP


def calculate_total_xp(current_level, current_xp_progress=0):
    complete_levels = current_level - 1 # `current_level` is in progress
    if complete_levels <= PHASE_1_MAX_BP_LEVEL:
        current_total_xp = MIN_XP
        for level in range(MIN_BP_LEVEL,current_level):
            current_total_xp = current_total_xp + (int((level - 1) / PHASE_1_LEVELS_PER_PAGE) * PHASE_1_XP_DELTA) + PHASE_1_BASE_XP
        return int(current_total_xp + current_xp_progress)
    if complete_levels <= PHASE_2_MAX_BP_LEVEL:
        return int(PHASE_1_TOTAL_XP + ((complete_levels - PHASE_1_MAX_BP_LEVEL) * PHASE_2_MAX_XP) + current_xp_progress)
    if complete_levels <= PHASE_3_MAX_BP_LEVEL:
        return int(PHASE_2_TOTAL_XP + ((complete_levels - PHASE_2_MAX_BP_LEVEL) * PHASE_3_MAX_XP) + current_xp_progress)
    

def print_report(current_level, current_xp, goal_level=None):
    print("=== Results ===")
    current_total_xp = calculate_total_xp(current_level, current_xp)
    print(f"Total XP for level {current_level} at {current_xp} XP: {current_total_xp}")
    if goal_level != None:
        goal_level_total_xp = calculate_total_xp(goal_level + 1) # add 1 so `goal_level` xp progress is complete
        print(f"Total XP to complete level {goal_level} XP: {goal_level_total_xp}")
        print(f"XP to complete level {goal_level}: {goal_level_total_xp - current_total_xp}")
        return
    else:
        phase_1_diff = int(PHASE_1_TOTAL_XP - current_total_xp)
        phase_2_diff = int(PHASE_2_TOTAL_XP - current_total_xp)
        phase_3_diff = int(PHASE_3_TOTAL_XP - current_total_xp)
        if phase_1_diff <= MIN_XP:
            phase_1_diff = "This level is complete"
        if phase_2_diff <= MIN_XP:
            phase_2_diff = "This level is complete"
        if phase_3_diff <= MIN_XP:
            phase_3_diff = "This level is complete"
        print(f"Total XP to complete level {PHASE_1_MAX_BP_LEVEL} ({PHASE_1_TOTAL_XP} XP): {phase_1_diff}")
        print(f"Total XP to complete level {PHASE_2_MAX_BP_LEVEL} ({PHASE_2_TOTAL_XP} XP): {phase_2_diff}")
        print(f"Total XP to complete level {PHASE_3_MAX_BP_LEVEL} ({PHASE_3_TOTAL_XP} XP): {phase_3_diff}")


def main():
    # get current progressing battle pass level
    current_level = None
    current_xp = None
    goal_level = None
    print("=== Input ===")
    while True:
        user_input = input("Enter your current battle pass level: ")
        if validate_level_value(user_input):
            current_level = int(user_input)
            break
        print("invalid battle pass level")
    while True:
        user_input = input(f"Enter your xp progress for level {current_level}: ")
        if user_input == "":
            current_xp = int(get_phase_max_xp(current_level))
            break
        if validate_xp_value(user_input, current_level):
            current_xp = int(user_input)
            break
        print("invalid xp value")
    while True:
        user_input = input(f"Enter the battle pass level you want to complete: ")
        if user_input == "":
            print_report(current_level, current_xp)
            return
        if validate_level_value(user_input, current_level):
            goal_level = int(user_input)
            break
        print("invalid battle pass level")
    print_report(current_level, current_xp, goal_level)


if __name__ == "__main__":
    main()
