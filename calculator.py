#!/usr/bin/python3

def calc_phase1_total_xp():
    total_xp = 0
    # level 1 to 96
    for i in range(1,96):
        total_xp = total_xp + ((i / 8) * 1000) + 6000
    return total_xp
    
phase1_total_xp = calc_phase1_total_xp()
phase2_total_xp = 50000 * 5
phase3_total_xp = 100000 * 5
total_xp = phase1_total_xp + phase2_total_xp + phase3_total_xp

def main():
    while True:
        current_level = int(input("enter your current battle pass level: "))
        if current_level < 1 or current_level > 106:
            print("invalid input")
        else:
            break
    while True:
        current_xp = int(input("enter your current xp progress: "))
        upper_limit = 0
        if current_level <= 96:
            upper_limit = 6000 + ((current_level / 8) * 1000)
        if current_level >= 97 and current_level <= 101:
            upper_limit = 50000
        if current_level <= 106:
            upper_limit = 100000
        if current_xp < 0 or current_xp > upper_limit:
            print("invalid input")
        else:
            break
    xp_left = int(get_total_xp_left(current_level, current_xp))
    print(f"you are on level {current_level} with {current_xp} xp")
    print(f"you need {xp_left - 750000} xp to get to finish level 96")
    print(f"you need {xp_left - 500000} xp to get to finish level 101")
    print(f"you need {xp_left} xp left to complete the battle pass with bonus pages")

def get_total_xp_left(current_level, current_xp_progress):
    return total_xp - get_current_total_xp(current_level, current_xp_progress)

def get_current_total_xp(current_level, current_xp_progress):
    current_total_xp = 0
    if current_level <= 96:
        # calculate xp for phase 1
        for i in range(1,current_level):
            current_total_xp = current_total_xp + ((i / 8) * 1000) + 6000
        return current_total_xp + current_xp_progress
    else:
        current_total_xp = phase1_total_xp
    if current_level <= 101:
        # calculate xp for phase 2
        return current_total_xp + ((101 - current_level) * 50000) + current_xp_progress
    else:
        current_total_xp = current_total_xp + phase2_total_xp
    if current_level<= 106:
        return current_total_xp + ((106 - current_level) * 100000) + current_xp_progress
    else:
        return current_total_xp + phase3_total_xp

def validate_xp_value(xp, current_level):
    upper_limit = 0
    if current_level <= 96:
        upper_limit = 6000 + ((current_level / 8) * 1000)
    if current_level >= 97 and current_level <= 101:
        upper_limit = 50000
    if current_level <= 106:
        upper_limit = 100000
    return (xp >= 0 or xp <= upper_limit)

def validate_level_value(current_level):
    return (current_level >= 1 and current_level <= 106)

if __name__ == "__main__":
    main()