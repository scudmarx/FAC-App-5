const STRENGTHS = {
    // good things
    CALM: "You are calm under pressure.",
    INSIGHTFUL: "You are good at understanding problems.",
    CHARMING: "People just seem to like you.",
    
    // bad things
    RUDE: "You can sometimes upset people without necessarily meaning to.",
    SLOW: "You don't always understand people, especially about complicated issues.",
    
    // assertiveness
    AGGRESSIVE: "You tell people what you want them do.",
    PASSIVE: "You do what other people want you to do.",
    ASSERTIVE: "You can balance what you need with what other people want.",

    // encounter conditions
    CLOSED: "The restaurant lobby is currently closed.",
    BROKEN: "Some equipment isn't working.",
    RUSHED: "It's really busy right now and the team is falling behind.",
}

function getRandomStrength() {
    let choice = Math.random() * 5
    if (choice < 1) {
        return STRENGTHS.CALM
    } else if (choice < 2) {
        return STRENGTHS.INSIGHTFUL
    } else if (choice < 3) {
        return STRENGTHS.CHARMING
    } else if (choice < 4) {
        return STRENGTHS.RUDE
    } else {
        return STRENGTHS.SLOW
    }
}

function getRandomCondition() {
    let choice = Math.random() * 3
    if (choice < 1) {
        return STRENGTHS.CLOSED
    } else if (choice < 2) {
        return STRENGTHS.BROKEN
    } else {
        return STRENGTHS.RUSHED
    }
}

function getRandomPersonality() {
    let choice = Math.random() * 5
    if (choice < 1) {
        return STRENGTHS.AGGRESSIVE
    } else if (choice < 2) {
        return STRENGTHS.PASSIVE
    } else {
        return STRENGTHS.ASSERTIVE
    }
}
