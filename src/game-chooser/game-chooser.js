const lists = require('../constants/gameChoices');

const gameChooser = (peopleActive) => {
    if (peopleActive[0] && peopleActive[1] && peopleActive[2] && peopleActive[3] && peopleActive[4]) {
        const five = new lists.fivePeople();
        var diceRoll = Math.floor(Math.random() * five.everyone.length);
        return five.everyone[diceRoll];
    }
}

module.exports.gameChooser = gameChooser;