import Bot from "./Bot.js";
import { createRequire } from "module";
import { execute as voiceraffleExecute } from "../commands/voiceraffle.js"
import Discord, { GatewayIntentBits, VoiceChannel } from "discord.js"

const {
    getVoiceConnection
} = createRequire(import.meta.url)("@discordjs/voice");

class MasterBot extends Bot {

    constructor({ name, token, createdBots }) {
        super({ name, token });
        this.createdBots = createdBots || [];

        this.client = new Discord.Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates
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
                const guild_name = interaction.member.guild.name;

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
                    this.logger.warn(`Not enough bots! Bot request in "${ voiceChannel.name }"`);
                    return interaction.reply({ content: 'Error: No available bots.', ephemeral: true });
                }

                const hasPerms = await availableBot.hasPerms(textChannel);

                if (hasPerms) {
                    availableBot.eventCall(callerType, interaction);
                    this.logger.log(`"${ availableBot.name }" calling '${ callerType }' in voice channel "${ voiceChannel.name }" for guild "${ guild_name }"`);
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
            return this;
        }

        for (const bot of this.createdBots) {
            if(bot.isAvailable(currentGuildId)) {
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