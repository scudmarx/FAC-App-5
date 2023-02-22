class Game {
    player = new Character()
    foe = new Foe()
    bad_decisions = 0
    commentary = "You are working in a restaurant when you notice a customer who seems unhappy about something."
    game_over = false

    isSuccessState = () => {
        let success = true
        let Unresolved = [
            TRAITS.PROBLEM_ANGRY,
            TRAITS.PROBLEM_NEEDS_TOILET,
            TRAITS.PROBLEM_OTHER,
            TRAITS.PROBLEM_RUDE_STAFF,
            TRAITS.PROBLEM_WRONG_ORDER,
            TRAITS.PROBLEM_UNKNOWN,
        ]
        for (const trait of Unresolved) {
            if (this.foe.traits.includes(trait)) success = false;
        }
        return success
    }
}

class Character {
    constructor(name = "Our Hero") {
        this.name = name
    }

    abilities = Object.values(ABILITIES)
    strengths = [getRandomStrength(), getRandomPersonality(), getRandomCondition()]

    getUsableAbilities = () => this.abilities.filter(ability => {
        //console.log(`Checking if ${ability.name} is usable...`)
        let ok = true
        ability.requiredTraits.forEach(trait => {
            //console.log(trait)
            if (trait && !App.game.foe.traits.includes(trait)) ok = false
        })
        ability.bannedTraits.forEach(trait => {
            //console.log(trait)
            if (App.game.foe.traits.includes(trait)) ok = false
        })
        ability.requiredStrengths.forEach(trait => {
            //console.log(trait)
            if (trait && !this.strengths.includes(trait)) ok = false
        })
        ability.bannedStrengths.forEach(trait => {
            //console.log(trait)
            if (this.strengths.includes(trait)) ok = false
        })
        return ok
    })

    useAbility = (ability) => {
        let outcome = ability.outcome(App.game)
        console.dir(outcome)
        
        if (outcome?.game_over) App.game.game_over = true
        App.game.foe.arousal += outcome.arousal
        App.game.foe.valence += outcome.valence

        App.game.foe.traits = App.game.foe.traits.filter(trait => !outcome.removeTraits.includes(trait))
        outcome.addTraits.forEach(trait => {
            App.game.foe.traits.push(trait)
        })

        App.game.bad_decisions += outcome.bad_decisions

        if (App.game.isSuccessState()) {
            App.game.game_over = true
            outcome.text += " The customer appears to be satisfied!"
        }

        App.game.commentary = outcome.text

        App.render()
    }
}

class Foe {
    constructor() {
        this.arousal = 25 + Math.floor(Math.random() * 50)
        if (this.arousal > 50) {
            this.traits.push(TRAITS.PROBLEM_ANGRY)
        }
    }
    name = "Angry Customer"
    valence = 20
    traits = [TRAITS.PROBLEM_UNKNOWN]
}


App = {
    onLoad: () => {
        App.player_target = document.getElementById("target_player")
        App.abilities_target = document.getElementById("target_abilities")
        App.foe_target = document.getElementById("target_foe")
        App.text_target = document.getElementById("target_commentary")
        console.dir(App.game)
        App.render()
    },
    game: new Game(),
    render: () => {
        console.dir(App.game)
        App.text_target.textContent = App.game.commentary

        if (App.game.game_over) {
            if (App.game.bad_decisions >= 2) App.text_target.textContent += " You hope you're not fired."
            if ((App.game.bad_decisions < 2) && (App.game.bad_decisions >= 1)) App.text_target.textContent += " You feel you could've handled that better."
            if (App.game.bad_decisions < 1) App.text_target.textContent += " You feel you did a great job there. Well done!"
            App.abilities_target.replaceChildren(StartOver())
        } else {
            
            App.player_target.replaceChildren()
            App.game.player.strengths.forEach(str => App.player_target.append(getTraitElement(str)))

            App.abilities_target.replaceChildren()
            let abilities = App.game.player.getUsableAbilities().map(abl => getAbilityButton(abl))
            abilities.forEach(abl => App.abilities_target.append(abl))
        }

        App.foe_target.replaceChildren()
        let foe = App.game.foe
        let customer = foe.traits
        if (App.game.game_over) {
            if (foe.valence > 20) customer.push("Left happy!")
        }
        customer.forEach(trait => App.foe_target.append(getTraitElement(trait)))
    },
}

function getAbilityButton(ability) {
    const node = document.createElement("span")
    node.className = "ability"
    node.textContent = ability.name
    node.addEventListener("click", () => App.game.player.useAbility(ability))
    return node
}

function getTraitElement(trait) {
    const node = document.createElement("span")
    node.className = "trait"
    node.textContent = trait
    return node
}

function StartOver() {
    const node = document.createElement("span")
    node.className = "ability"
    node.textContent = "Start Over"
    node.addEventListener("click", () => {App.game = new Game(); App.render()})
    return node
}
