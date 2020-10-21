var Discord = require('discord.js');
const { createLogger, format, transports } = require('winston');
const gameChooser = require('./game-chooser/game-chooser').gameChooser;
const updateUsersGames = require('./game-chooser/game-chooser').updateUsersGames;
const deleteAllPlayerGames = require('./game-chooser/game-chooser').deleteAllPlayerGames;

// initialize logger
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
    ),
    defaultMeta: { service: 'your-service-name' },
    transports: [
        //
        // - Write to all logs with level `info` and below to `quick-start-combined.log`.
        // - Write all logs error (and below) to `quick-start-error.log`.
        //
        new transports.File({ filename: 'discord-errors.log', level: 'error' }),
        new transports.File({ filename: 'quick-start-combined.log' })
    ]
});

logger.add(new transports.Console({
    format: format.combine(
        format.colorize(),
        format.simple()
    )
}));

// Initialize Discord Bot
try {
    var bot = new Discord.Client();
    bot.on('ready', function (evt) {
        console.log('I am ready');
    });
    bot.on('message', async (message) => {
        // Our bot needs to know if it will execute a command
        // It will listen for messages that will start with `!`
        if (message.content.substring(0, 1) == '!') {
            // Split the input if it contains a space to support giving
            // arguments to a command
            command = message.content
            if(command.indexOf(' ') != -1) {
               command =  command.substring(0,command.indexOf(' '));
            }
            console.log(command);
            command = command.toLocaleLowerCase()
            switch (command) {
                // !ping
                case '!ping':
                    message.channel.send('pong');
                    break;
                case '!help':
                    message.channel.send(`Currently supported commands
                    !pickGame: Suggests a game to play
                    !myGames:  Set the games you want to play. Seperate each game by comma
                    !deleteAllMyGames: Deletes user's game list from database
                    !online:   Messages all online users asking to join the channel
                    !ping:     Replies with 'pong'`);
                    break;
                case '!pickgame':
                    // Pick a game for the members in a voice channel
                    const voiceChannel = message.member.voice.channel;
                    if(!voiceChannel){
                        return message.channel.send("Please join voice channel");
                    }
                    vcUsers = voiceChannel.members.map(user => user.user.username);
                    gameChooser(vcUsers).then(result => {
                      console.log("return from gameChooser: " + result);
                      message.channel.send(result);
                    });
                    break;
                // Just add any case commands if you want to..
                case '!online':
                    message.channel.members.each(async (user) => {
                        try {
                            if ((user.presence.status === "online" || user.presence.status === "idle") && !user.displayName.toLocaleLowerCase().includes('bot')) {
                                const dm = await user.createDM();
                                if (user.displayName.toLocaleLowerCase() === message.author.username.toLocaleLowerCase()) {
                                    dm.send("The task started successfully");
                                } else {
                                    dm.send(`@${message.author.username} from ${message.guild} want's to know if you're online`);
                                }
                            }
                        } catch (ex) {
                            logger.log({
                                level: 'error',
                                message: ex
                            });
                        }
                    });
                    break;
                case '!mygames':
                    userName = message.author.username;
                    // Game list will be everything after the space 
                    gameStr = message.content.toLocaleLowerCase();
                    if(gameStr.indexOf(" ") != -1){
                      gameStr = gameStr.substring(gameStr.indexOf(" ")+1);
                    } else {
                      gameStr = "";
                    }
                    updateUsersGames(userName, gameStr).then(function(result) {
                      message.channel.send(userName + "'s Games are: " + result.row);
                    }, function(err){
                      console.log(err)
                    });
                    break;
                case '!deleteallmygames':
                    userName = message.author.username;
                    deleteAllPlayerGames(userName).then(function(result) {
                      message.channel.send("Deleted "+userName + "'s data from database");
                    });
                    break;
                case '!almond':
                    if (message.guild.name.toLocaleLowerCase().includes('almonds'))
                        await message.react(message.guild.emojis.cache.find(emoji => emoji.name.toLocaleLowerCase() === 'almond'));
                    break;
                default:
                    await message.react('😕');
            }
        }
    });
    bot.on('ready', () => console.log("bot connected"));

    bot.login(process.env.SECRET);
} catch (ex) {
    logger.log({
        level: 'error',
        message: ex
    });
}
