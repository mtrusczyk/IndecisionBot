var Discord = require('discord.js');
const env = require('dotenv').config();
const gameChooser = require('./game-chooser/game-chooser').gameChooser;
// Initialize Discord Bot
var bot = new Discord.Client();
bot.on('ready', function (evt) {
    console.log('I am ready');
    // console.log(bot.username + ' - (' + bot.id + ')');
});
bot.on('message', message => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.content.substring(0, 1) == '!') {
        console.log(message);
        console.log(bot);
        switch (message.content) {
            // !ping
            case '!ping':
                message.channel.send('pong');
                break;
            case '!pickGame':
                message.channel.send(gameChooser([true, true, true, true, true]))
                break;
                // Just add any case commands if you want to..
            case '!online':
                console.log(bot.users);
                break;
        }
    }
});
bot.on('ready', () => console.log(bot.channels.cache.each(channel => console.log(channel))));

bot.login(process.env.SECRET);