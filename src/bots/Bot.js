import path from "path";
import { createRequire } from "module";
import { v4 as uuidv4 } from "uuid";
import logger from "../util/Logger.js";
import Timer from "../util/Timer.js";
import { Default_Lang, AUDIO } from "../config.js";
import Discord, { Intents, MessageActionRow, MessageButton, TextChannel } from "discord.js";

const {
    joinVoiceChannel,
    VoiceConnectionStatus,
    getVoiceConnection
} = createRequire(import.meta.url)("@discordjs/voice");

class Bot
{
    constructor({ name, token }) {
        this.ID = uuidv4();
        
        this.client = new Discord.Client({
            intents: [
                Intents.FLAGS.GUILDS,
                Intents.FLAGS.GUILD_MEMBERS,
                Intents.FLAGS.GUILD_MESSAGES,
                Intents.FLAGS.GUILD_VOICE_STATES
            ]
        });
    
        this.name = name;
        this.token = token;
        this.lang = Default_Lang;
        this.timers = [];
        this.audio = AUDIO(this.lang); 
        this.logger = logger(`${ path.resolve('logs') }/${ name }.log`);

        this.initialise();
    }
    
    initialise = () => { 
        this.client.login(this.token)
            .catch(console.error)
        ;

        this.client.once('ready', () => {
            this.logger.info('Client is ready.');            
        });

        this.client.on('voiceStateUpdate', (oldState, newState) => { 
            if (oldState.member && oldState.member.user.id === this.client.user.id) {
                const oldId = oldState.channelId;
                const newId = newState.channelId;

                if (oldId && newId && oldId !== newId) {
                    this.logger.warn('Bot moved voice channels. Stopping...');
                    this.stopCommand(newState.guild.id);
                }
            }
        });
    }

    isAvailable = (guildId) => {
        const guild = this.client.guilds.cache.get(guildId);

        if (!guild) {
            this.logger.warn(`Not in server for guild id: ${guildId}`);
            return false;
        }

        const connection = getVoiceConnection(guildId, this.ID);

        if (
            connection &&
            connection.state &&
            (connection.state.status !== VoiceConnectionStatus.Destroyed ||
                connection.state.status !== VoiceConnectionStatus.Disconnected) &&
            connection.joinConfig.guildId === guildId
        ) {
            this.logger.warn(`Voice connection is not destroyed or disconnected for guild id: ${guildId}`);
            return false;
        }

        return true;
    }
    
    hasPerms = async (textChannel) => { 
        try {
            const guild = textChannel.guild;
            await guild.members.fetch();
            const botMember = guild.members.cache.get(this.client.user.id);
            const botPermissions = botMember.permissionsIn(textChannel);
    
            if (botPermissions) {
                const hasViewAndSendPermissions = botPermissions.has(['VIEW_CHANNEL', 'SEND_MESSAGES']);
                return hasViewAndSendPermissions;
            } else {
                this.logger.error(`Unable to retrieve permissions in channel: ${textChannel.id}`);
                return false;
            }
        } catch (error) {
            this.logger.error(`Error checking permissions: ${error}`);
            return false;
        }
    }

    eventCall = async (type, interaction) => {
        const textChannelId = interaction.channelId;
        const voiceChannelId = interaction.member.voice.channel.id;
        const voiceChannelName = interaction.member.voice.channel.name;
        const guild_id = interaction.guildId;
        const guild_name = interaction.member.guild.name;
        const guild = await this.client.guilds.fetch(guild_id);

        this.createButtons(textChannelId);

        if (guild) {
            this.logger.info(`Attempting to join voice channel "${ voiceChannelName }" in guild: "${ guild_name }"`);

            const connection = joinVoiceChannel({
                channelId: voiceChannelId,
                guildId: guild_id,
                adapterCreator: guild.voiceAdapterCreator,
                group: this.ID
            });

            const timer = new Timer(this.name, guild_id, connection, this, type);
            this.timers.push({ guildId: guild_id, timer: timer});
        }
    }

    changeLang = (lang, guild_id) => {
        const current = this.timers.find((timer) => timer.guildId === guild_id);
        current.timer.changeLang(lang);
    }

    removeTimer = (guild_id) => {
        const current = this.timers.find((timer) => timer.guildId === guild_id);
        current.timer.stopTimer();
        this.timers = this.timers.filter((timer) => timer.guildId !== guild_id);
    }

    stopCommand = (guildId) => { 
        this.logger.log(`Stop command launched for guild id: ${ guildId }`);
        const connection = getVoiceConnection(guildId, this.ID);

        if (connection?.state?.status === VoiceConnectionStatus.Ready) {
            connection?.destroy();
            this.removeTimer(guildId);
        }
    }

    deleteButtons = async (textChannelId) => {
        try {
            const channel = await this.client.channels.fetch(textChannelId);
    
            if (channel instanceof TextChannel) {
                const messages = await channel.messages.fetch({ limit: 50 });
                const botCompMessages = messages.filter(message =>
                    message.author.id === this.client.user.id &&
                    message.components &&
                    message.components.length > 0
                );
    
                botCompMessages.forEach(async message => {
                    await message.delete();
                });
            }
        } catch (error) {
            this.logger.error(`Error deleting buttons in text channel: ${ textChannelId } - ${ error.message }`);
        } 
    }

    createButtons = async (textChannelId) => {  
        await this.deleteButtons(textChannelId);

        this.client.guilds.cache.forEach(async (guild) => {
                const channel = guild.channels.cache.get(textChannelId);
                if (channel instanceof TextChannel) {
                    this.logger.log(`Creating buttons in: "${ channel.name }" for "${ guild.name }"`)
                    const stopButton = new MessageButton({
                        customId: uuidv4(),
                        label: 'Stop',
                        style: 'DANGER',
                        emoji: '✋'
                    });

                    await channel.send({
                        components: [
                            new MessageActionRow().addComponents([
                                stopButton
                            ])
                        ]
                    });

                    const collector = channel.createMessageComponentCollector();
                    collector.on('collect', (interaction) => {
                        const { componentType, customId } = interaction;

                        if (componentType === 'BUTTON') {
                            switch (customId) {
                                case stopButton.customId:
                                    this.stopCommand(interaction.guildId);
                                    interaction.message.delete();
                                    break;
                            }
                        }
                    })
                }
            })
    }
}

export default Bot;