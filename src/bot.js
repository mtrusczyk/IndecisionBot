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
                bot.users.cache.forEach(user => {
                    console.log('user', user.username);
                    console.log('presence', user.presence);
                })
                const online = bot.users.cache.filter(user => (user.presence.status === "online" || user.presence.status === "idle") && user.username !== 'Game Choosing Bot');
                console.log(online);
                online.forEach(async onlineUser => {
                    try {
                        console.log(onlineUser.username);
                        const dm = await onlineUser.createDM()
                        console.log('dm', dm);
                        dm.send(`@${onlineUser.username}`);
                    } catch (ex) {

                    }

                });
                break;
        }
    }
});
bot.on('ready', () => console.log('started'));

bot.login(process.env.SECRET);