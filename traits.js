const TRAITS = {
    // traits related to current progress
    MISUNDERSTOOD: "Doesn't feel understood.",
    EXPLAINED: "Believes they have explained.",

    // personality traits
    SHY: "Shy",
    AGGRESSIVE: "Aggressive",
    RUSHED: "In a rush",
    CONFUSING: "Hard to understand.",

    // what problem(s) are they having?
    PROBLEM_UNKNOWN: "Has a problem.",
    PROBLEM_NEEDS_TOILET: "Needs to use the toilet",
    PROBLEM_WRONG_ORDER: "Received the wrong food.",
    PROBLEM_RUDE_STAFF: "Your colleague was rude to them.",
    PROBLEM_OTHER: "You understand their problem.",
    PROBLEM_ANGRY: "Is angry.",
    PROBLEM_RESOLVED: "Had an issue resolved!",
}

const getRandomProblem = () => {
    let choice = Math.random() * 100
    if (choice < 10) {
        return TRAITS.PROBLEM_NEEDS_TOILET
    } else if (choice < 25) {
        return TRAITS.PROBLEM_RUDE_STAFF
    } else if (choice < 80) {
        return TRAITS.PROBLEM_WRONG_ORDER
    } else if (choice < 90) {
        return TRAITS.PROBLEM_ANGRY
    } else {
        return TRAITS.PROBLEM_OTHER
    }
}
