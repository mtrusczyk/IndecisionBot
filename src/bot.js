var Discord = require('discord.js');
const { createLogger, format, transports } = require('winston');
const gameChooser = require('./game-chooser/game-chooser').gameChooser;

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
