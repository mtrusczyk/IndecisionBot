var Discord = require('discord.io');
const env = require('dotenv').config();
// Initialize Discord Bot
console.log('secret', process.env.SECRET);
var bot = new Discord.Client({
    token: process.env.SECRET,
    autorun: true
});
bot.on('ready', function (evt) {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch (cmd) {
            // !ping
            case 'ping':
                bot.sendMessage({
                    to: channelID,
                    message: 'Pong!'
                });
                break;
            case 'pickGame':
                chooseGames('TallMattSamAustin', channelID);
                // Just add any case commands if you want to..
        }
    }
});

const chooseGames = (usersOn, channelID) => {
    switch (usersOn) {
        case 'TallMattSamAustin':
            bot.sendMessage({
                to: channelID,
                message: 'Starcraft2'
            });
    }
}