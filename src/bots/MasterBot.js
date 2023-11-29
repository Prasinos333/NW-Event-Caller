import Bot from "./Bot.js";
import { createRequire } from "module";
import Discord, { Intents, VoiceChannel } from "discord.js";
import { execute as voiceraffleExecute } from "../commands/voiceraffle.js"

const {
    getVoiceConnection
} = createRequire(import.meta.url)("@discordjs/voice");

class MasterBot extends Bot {

    constructor({ name, token, createdBots }) {
        super({ name, token });
        this.createdBots = createdBots || [];

        this.client = new Discord.Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_VOICE_STATES
            ]
        });

        this.initialise();
    }

    initialise = () => {
        this.client.login(this.token)
            .catch(console.error)
        ;

        this.client.on('interactionCreate', async interaction => { 
            if (!interaction.isCommand()) return;
        
            const { commandName } = interaction;
        
            if (commandName === 'addcaller') { 
                const voiceChannel = interaction.member?.voice?.channel;
                const textChannel = interaction.channel;

                if(textChannel instanceof VoiceChannel) {
                    return interaction.reply({ content: 'Error: Cannot start in voice channel chat.', ephemeral: true });
                }

                if(!voiceChannel) {
                    return interaction.reply({ content: 'Error: You are not currently in a voice channel.', ephemeral: true });
                }

                if (!voiceChannel.viewable) {
                    return interaction.reply({ content: "Error: Lacking 'View Channel' permission.", ephemeral: true });
                }

                if (!voiceChannel.joinable) {
                    return interaction.reply({ content: "Error: Lacking 'Connect Channel' permission.", ephemeral: true });
                }

                if (voiceChannel.full) {
                    return interaction.reply({ content: "Error: Channel is full", ephemeral: true });
                }

                const callerType = interaction.options.getString('type');

                if (!callerType) {
                    return interaction.reply({ content: 'Error: Unable to retrieve bot caller type.', ephemeral: true }); 
                }

                if(this.hasBot(voiceChannel)) {
                    return interaction.reply({ content: 'Error: Voice channel currently has active bot. Press stop to change type', ephemeral: true });
                }
                
                const availableBot = this.getAvailableBot(interaction.guildId);
                if (!availableBot) {
                    return interaction.reply('Error: No available bots.');
                }

                const hasPerms = await availableBot.hasPerms(textChannel);

                if (hasPerms) {
                    availableBot.eventCall(callerType, interaction);
                    this.logger.log(`"${ availableBot.name }" calling '${ callerType }' in voice channel: "${ voiceChannel.name }"`);
                    return interaction.reply({content: `Adding \`${ availableBot.client.user.username }\` to \`${ voiceChannel.name }\``, ephemeral: true});  
                } else {
                    return interaction.reply({ content: `Error: ${ availableBot.name } can't send messages to this channel.`, ephemeral: true });
                }
            }
        
            if(commandName === 'voiceraffle') { 
                await voiceraffleExecute(interaction);
                const guild_name = interaction.member.guild.name;
                this.logger.log(`Raffle completed in "${ guild_name }" for channel: "${ interaction.channel.name }"`);
            }
        });
    }

    getAvailableBot = (currentGuildId) => {
        if (this.isAvailable(currentGuildId)) {
            this.logger.info(`${this.name} is available!`);
            return this;
        }

        for (const bot of this.createdBots) {
            if(bot.isAvailable(currentGuildId)) {
                this.logger.info(`${ bot.name } is available!`);
                return bot;
            } 
        }

        return null;
    }

    hasBot = (voiceChannel) => { 
        const masterConnection = getVoiceConnection(voiceChannel.guild.id, this.ID);
        if(masterConnection?.joinConfig.channelId === voiceChannel.id) {
            return true;
        }

        for (const bot of this.createdBots) {
            const connection = getVoiceConnection(voiceChannel.guild.id, bot.ID);
            if(connection?.joinConfig.channelId === voiceChannel.id) {
                return true;
            }
        }

        return false;
    }
}

export default MasterBot;