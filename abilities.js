class Ability {
    constructor(name = "Attempt to Help") {
        this.name = name
    }
    requiredTraits = []
    bannedTraits = []
    requiredStrengths = []
    bannedStrengths = []
    outcome = (Game) => {
        return new Outcome("You helped!")
    }
}

class Outcome {
    constructor(text = "You helped!") {
        this.text = text
    }
    arousal = 10
    valence = -5
    bad_decisions = 0
    game_over = false
    addTraits = []
    removeTraits = []
}

const Fix = new Ability("Fix Problem")
Fix.requiredTraits = [TRAITS.PROBLEM_OTHER]
Fix.outcome = (game) => {
    let outcome = new Outcome("You resolve the issue.")
    outcome.arousal = -15
    outcome.valence = 15
    if (game.player.strengths.includes(STRENGTHS.CHARMING)) outcome.valence += 2
    if (game.player.strengths.includes(STRENGTHS.RUDE)) { outcome.arousal += 3; outcome.valence -= 3 }
    outcome.removeTraits = [TRAITS.PROBLEM_OTHER, TRAITS.EXPLAINED]
    outcome.addTraits =  [TRAITS.PROBLEM_RESOLVED]

    return outcome
}

const Ask = new Ability("Ask what's wrong")
Ask.requiredTraits = [TRAITS.PROBLEM_UNKNOWN]
Ask.outcome = (game) => {
    let outcome = new Outcome("You ask the customer about their problem. ")
    outcome.addTraits = []
    if (game.foe.traits.includes(TRAITS.EXPLAINED)) {
        outcome.text += "They feel they've already explained this perfectly well and are angry at having to repeat themselves."
        outcome.arousal = game.foe.traits.includes(TRAITS.AGGRESSIVE) ? 10 : 5
        outcome.valence = -5
    } else {
        outcome.text += "They attempt to describe the problem."
        outcome.addTraits.push(TRAITS.EXPLAINED)
        outcome.arousal = game.foe.traits.includes(TRAITS.MISUNDERSTOOD) ? -5 : 0
        outcome.valence = game.foe.traits.includes(TRAITS.MISUNDERSTOOD) ? -5 : 0
    }
    
    if (game.player.strengths.includes(STRENGTHS.CHARMING)) outcome.valence += 2
    if (game.player.strengths.includes(STRENGTHS.RUDE)) outcome.arousal += 3

    if ((game.foe.arousal + outcome.arousal) > 75) {
        if (!game.foe.traits.includes(TRAITS.PROBLEM_ANGRY)) outcome.addTraits.push(TRAITS.PROBLEM_ANGRY)
    }

    let successrate = 50
    if (game.player.strengths.includes(STRENGTHS.SLOW)) successrate -= 10
    if (game.player.strengths.includes(STRENGTHS.INSIGHTFUL)) successrate += 25
    if (game.foe.traits.includes(TRAITS.CONFUSING)) successrate -= 10
    if (game.foe.traits.includes(TRAITS.PROBLEM_ANGRY)) successrate -= 10
    if ((Math.random() * 100) < successrate) {
        outcome.text += " You understand the problem."
        outcome.removeTraits = [TRAITS.PROBLEM_UNKNOWN, TRAITS.MISUNDERSTOOD]
        outcome.addTraits.push(getRandomProblem())
    } else {
        outcome.text += " Unfortunately, you don't get what they're trying to say."
    }

    outcome.bad_decisions += game.player.strengths.includes(STRENGTHS.RUSHED) ? 0.2 : 0

    return outcome
}

const Fix_Toilet = new Ability("Show the way.")
Fix_Toilet.bannedStrengths = [STRENGTHS.CLOSED]
Fix_Toilet.requiredTraits = [TRAITS.PROBLEM_NEEDS_TOILET]
Fix_Toilet.outcome = (game) => {
    let outcome = new Outcome("You show them where the toilet is.")
    outcome.arousal = 0
    outcome.valence = 10
    if (game.player.strengths.includes(STRENGTHS.CHARMING)) outcome.valence += 5
    if (game.player.strengths.includes(STRENGTHS.RUDE)) { outcome.arousal += 5; outcome.valence -= 5 }

    outcome.removeTraits = [TRAITS.PROBLEM_NEEDS_TOILET, TRAITS.EXPLAINED]
    outcome.addTraits =  [TRAITS.PROBLEM_RESOLVED]

    return outcome
}

const Toilet_Closed_Passive = new Ability("Let them in anyway.")
Toilet_Closed_Passive.requiredStrengths = [STRENGTHS.CLOSED, STRENGTHS.PASSIVE]
Toilet_Closed_Passive.requiredTraits = [TRAITS.PROBLEM_NEEDS_TOILET]
Toilet_Closed_Passive.outcome = (game) => {
    let outcome = new Outcome("You show them where the toilet is.")
    outcome.arousal = 0
    outcome.valence = 10
    if (game.player.strengths.includes(STRENGTHS.CHARMING)) outcome.valence += 5
    if (game.player.strengths.includes(STRENGTHS.RUDE)) { outcome.arousal += 2; outcome.valence -= 3 }
    outcome.bad_decisions = 2
    outcome.removeTraits = [TRAITS.PROBLEM_NEEDS_TOILET, TRAITS.EXPLAINED]
    outcome.addTraits =  [TRAITS.PROBLEM_RESOLVED]

    return outcome
}

const Toilet_Closed = new Ability("Explain the toilets are closed.")
Toilet_Closed.requiredStrengths = [STRENGTHS.CLOSED]
Toilet_Closed.bannedStrengths = [STRENGTHS.AGGRESSIVE]
Toilet_Closed.requiredTraits = [TRAITS.PROBLEM_NEEDS_TOILET]
Toilet_Closed.outcome = (game) => {
    let outcome = new Outcome("You explain that the lobby is currently closed. ")
    outcome.arousal = 10
    outcome.valence = -5
    if (game.player.strengths.includes(STRENGTHS.AGGRESSIVE)) { outcome.arousal += 10 }
    if (game.player.strengths.includes(STRENGTHS.CHARMING)) outcome.valence += 2
    if (game.player.strengths.includes(STRENGTHS.RUDE)) { outcome.arousal += 3; outcome.valence -= 3 }
    outcome.removeTraits = [TRAITS.PROBLEM_NEEDS_TOILET, TRAITS.EXPLAINED]
    if ((game.foe.arousal + outcome.arousal) > 75) {
        outcome.text += "They get angry."
        outcome.addTraits =  [TRAITS.PROBLEM_ANGRY]
    } else {
        outcome.text += "They don't like it but they understand."
        outcome.addTraits =  [TRAITS.PROBLEM_RESOLVED]
    }

    return outcome
}

const Fix_Order = new Ability("Fix their order.")
Fix_Order.requiredTraits = [TRAITS.PROBLEM_WRONG_ORDER]
Fix_Order.outcome = (game) => {
    let outcome = new Outcome("You let the customer know you'll get it corrected immediately, then you do so.")
    outcome.arousal = -15
    outcome.valence = 10
    if (game.player.strengths.includes(STRENGTHS.CHARMING)) outcome.valence += 5
    if (game.player.strengths.includes(STRENGTHS.RUDE)) { outcome.arousal += 5; outcome.valence -= 3 }

    if (game.player.strengths.includes(STRENGTHS.BROKEN)) {
        if (Math.random() < 0.5) {
            outcome.text = "Unfortunately, the equipment to make what they want is broken! You offer them a replacement or refund instead."
            outcome.arousal -= 5
            outcome.valence -= 5
            if (game.player.strengths.includes(STRENGTHS.ASSERTIVE)) { outcome.arousal += 5; outcome.valence -= 3 }
        }
    }

    outcome.removeTraits = [TRAITS.PROBLEM_WRONG_ORDER, TRAITS.EXPLAINED]
    outcome.addTraits =  [TRAITS.PROBLEM_RESOLVED]
    
    return outcome
}

const Fix_Rude = new Ability("Apologise and promise to talk to the rude staff member.")
Fix_Rude.requiredTraits = [TRAITS.PROBLEM_RUDE_STAFF]
Fix_Rude.outcome = (game) => {
    let outcome = new Outcome("You let the customer know you'll have a word with the staff member about it.")
    outcome.arousal = -15
    outcome.valence = 5
    if (game.player.strengths.includes(STRENGTHS.CHARMING)) outcome.valence += 5
    if (game.player.strengths.includes(STRENGTHS.RUDE)) { outcome.arousal += 15; outcome.valence -= 5 }
    outcome.removeTraits = [TRAITS.PROBLEM_RUDE_STAFF, TRAITS.EXPLAINED]
    if ((game.foe.arousal + outcome.arousal) > 75) {
        outcome.text += "They are still quite angry though."
        if (!game.foe.traits.includes(TRAITS.PROBLEM_ANGRY)) outcome.addTraits = [TRAITS.PROBLEM_ANGRY]
    } else {
        outcome.text += "The customer thanks you."
        outcome.addTraits =  [TRAITS.PROBLEM_RESOLVED]
    }
    
    return outcome
}

const Kick_Out = new Ability("Ask them to leave.")
Kick_Out.bannedStrengths = [STRENGTHS.PASSIVE]
Kick_Out.outcome = (game) => {
    let outcome = new Outcome("You tell the customer to leave the store.")
    outcome.arousal = 15
    outcome.valence = -15
    if (game.player.strengths.includes(STRENGTHS.ASSERTIVE)) { outcome.arousal += 3; outcome.valence += 3 }
    if (game.player.strengths.includes(STRENGTHS.AGGRESSIVE)) { outcome.arousal += 15; outcome.valence -= 3 }
    if ((game.foe.arousal + outcome.arousal) > 75) {
        outcome.text += " They are not happy about it."
        if (!game.foe.traits.includes(TRAITS.PROBLEM_ANGRY)) outcome.addTraits = [TRAITS.PROBLEM_ANGRY]
    }
    outcome.bad_decisions = game.foe.traits.includes(TRAITS.PROBLEM_ANGRY) ? 1 : 3
    if (game.player.strengths.includes(STRENGTHS.RUSHED)) outcome.bad_decisions -= 1
    if (game.player.strengths.includes(STRENGTHS.CLOSED)) outcome.bad_decisions = 0
    outcome.game_over = true
    
    return outcome
}

const Calm = new Ability("Attempt to calm them down.")
Calm.outcome = (game) => {
    let outcome = new Outcome("You attempt to calm the customer down by showing sympathy and compassion.")
    outcome.arousal = -20
    outcome.valence = 0

    if (game.player.strengths.includes(STRENGTHS.ASSERTIVE)) { outcome.arousal -= 5; outcome.valence += 5 }
    if (game.player.strengths.includes(STRENGTHS.AGGRESSIVE)) { outcome.arousal += 5; outcome.valence -= 3 }
    if (game.player.strengths.includes(STRENGTHS.RUDE)) { outcome.arousal += 5; outcome.valence -= 3 }
    if (game.player.strengths.includes(STRENGTHS.CALM)) { outcome.arousal -= 5 }
    if (game.player.strengths.includes(STRENGTHS.CHARMING)) { outcome.valence += 5 }

    if (game.foe.traits.includes(TRAITS.PROBLEM_ANGRY)) {
        if ((game.foe.arousal + outcome.arousal) > 50) {
            outcome.text += "They are still quite angry though."
        } else {
            outcome.text += "They seem calmer, and thank you for your kindness."
            outcome.removeTraits = [TRAITS.PROBLEM_ANGRY]
            outcome.addTraits =  [TRAITS.PROBLEM_RESOLVED]
        }
    } else {
        outcome.arousal += 35
        outcome.valence -= 5
        outcome.bad_decisions = 1
        outcome.text += "The customer seems upset by the suggestion that they weren't already perfectly calm. "
        outcome.addTraits = [TRAITS.MISUNDERSTOOD]
        if ((game.foe.arousal + outcome.arousal) > 75) {
            outcome.text += "Now they actually are angry."
            outcome.addTraits =  [TRAITS.PROBLEM_ANGRY]
        }
    }

    outcome.bad_decisions += game.player.strengths.includes(STRENGTHS.RUSHED) ? 0.2 : 0

    return outcome
}

const Bribe = new Ability("Offer them free food.")
Bribe.outcome = (game) => {
    let outcome = new Outcome("You attempt to calm the customer down by offering them some free food.")
    outcome.arousal = -20
    outcome.valence = 10
    outcome.bad_decisions = game.player.strengths.includes(STRENGTHS.RUSHED) ? 0 : 1
    outcome.removeTraits = [TRAITS.PROBLEM_WRONG_ORDER]

    if ((game.foe.arousal + outcome.arousal) > 50) {
        outcome.text += "They are still quite upset though."
    } else {
        outcome.text += "They seem calmer now."
        outcome.removeTraits.push(TRAITS.PROBLEM_ANGRY)
        outcome.addTraits =  [TRAITS.PROBLEM_RESOLVED]
    }

    return outcome
}

const ABILITIES = {
    Kick_Out: Kick_Out,
    Ask: Ask,
    Fix: Fix,
    Fix_Toilet: Fix_Toilet,
    Toilet_Closed: Toilet_Closed,
    Toilet_Closed_Passive: Toilet_Closed_Passive,
    Fix_Order: Fix_Order,
    Fix_Rude: Fix_Rude,
    Calm: Calm,
    Bribe: Bribe,
}
