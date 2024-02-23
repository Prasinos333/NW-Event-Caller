import path from "path";
import { createRequire } from "module";
import { v4 as uuidv4 } from "uuid";
import logger from "../util/Logger.js";
import Timer from "../util/Timer.js";
import { Default_Lang, AUDIO } from "../config.js";
import Discord, { GatewayIntentBits, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, TextChannel, ButtonStyle, PermissionsBitField, ComponentType } from "discord.js";

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
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates
            ]
        });
    
        this.name = name;
        this.token = token;
        this.lang = Default_Lang;
        this.timers = [];
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
            this.logger.warn(`Not in server for guild id: ${ guildId }`);
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
            // this.logger.info(`Voice connection is not destroyed or disconnected in guild id: ${guildId}`);
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
                const hasViewAndSendPermissions = botPermissions.has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages]);
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

        const buttonData = await this.createButtons(textChannelId);

        if (guild) {
            this.logger.info(`Attempting to join voice channel "${ voiceChannelName }" in guild: "${ guild_name }"`);

            const connection = joinVoiceChannel({
                channelId: voiceChannelId,
                guildId: guild_id,
                adapterCreator: guild.voiceAdapterCreator,
                group: this.ID
            });

            const timer = new Timer(this.name, guild_id, connection, this, type, buttonData);
            this.timers.push({ guildId: guild_id, timer: timer});
        }
    }

    changeLang = (lang, guild_id) => {
        const current = this.timers.find((timer) => timer.guildId === guild_id);
        current.timer.changeLang(lang);
    }

    removeTimer = (guild_id) => {
        const current = this.timers.find((timer) => timer.guildId === guild_id);
        current.timer.clearTimerInterval();
        this.timers = this.timers.filter((timer) => timer.guildId !== guild_id);
    }

    stopCommand = (guildId, userID = 0) => {
        const guild = this.client.guilds.cache.get(guildId);
        switch(userID) {
            case 0:
                this.logger.log(`Stop command launched for guild: "${ guild.name }"`);
                break;
            default:
                this.logger.log(`Stop command launched for guild: "${ guild.name }" by user: ${ userID }`);
                break;
        }
        
        const connection = getVoiceConnection(guildId, this.ID);

        if (connection?.state?.status === VoiceConnectionStatus.Ready) {
            connection?.destroy();
            this.removeTimer(guildId);
        }
    }

    deleteButton = async (buttonData) => {
        if(buttonData) {
            const { textChannelId, messageId } = buttonData;

            if (textChannelId && messageId) {
                const channel = await this.client.channels.fetch(textChannelId);
    
                if (channel instanceof TextChannel) {
                    const message = await channel.messages.fetch(messageId)
                        .catch((err) => {
                        if (err.httpStatus === 404) {
                            this.logger.error('Message already deleted');
                        } else {
                            this.logger.error(`Error fetching message ${ messageId }`);
                        }
                    });

                    if (message) {
                        await message.delete()
                            .then(() => this.logger.info('Message deleted successfully'))
                            .catch((err) => this.logger.error(`Error deleting message ${ messageId }`, err));;
                        }
                    }
            }
        }  
    }

    createButtons = async (textChannelId) => {  
        return new Promise(async (resolve, reject) => {
            let messageId;
    
            try {
                this.client.guilds.cache.forEach(async (guild) => {
                    const channel = guild.channels.cache.get(textChannelId);
                    if (channel instanceof TextChannel) {
                        this.logger.log(`Creating buttons in: "${ channel.name }" for "${ guild.name }"`)
                        const stopButton = new ButtonBuilder()
                            .setCustomId('stop')
                            .setLabel('Stop')
                            .setStyle(ButtonStyle.Danger)
                            .setEmoji('✋');

                        const configSelect = new StringSelectMenuBuilder() 
                            .setCustomId('select')
                            .setPlaceholder('Change Voice')
                            .addOptions([
                                {
                                    label: 'Kimberly (EN)',
                                    description: 'The first and default voice of the bot',
                                    value: `en_1`,
                                },
                                {
                                    label: 'Rachel (EN)',
                                    description: 'Provided by JakeL',
                                    value: `en_2`,
                                }
                            ]);
    
                        const message = await channel.send({
                            components: [
                                new ActionRowBuilder().addComponents(configSelect),
                                new ActionRowBuilder().addComponents(stopButton)
                            ]
                        });
    
                        messageId = message.id;
                        const collector = channel.createMessageComponentCollector();

                        collector.on('collect', async (interaction) => {
                            const { componentType } = interaction;
    
                            if (componentType === ComponentType.Button) { 
                                this.stopCommand(interaction.guildId, interaction.user.id);
                                interaction.message.delete();
                            } else if (componentType === ComponentType.StringSelect) {
                                const newLang = interaction.values[0];

                                this.changeLang(newLang, interaction.guildId);
                                
                                await interaction.reply({content: `Changed voice to \`${ newLang }\``, ephemeral: true});
                                this.logger.info(`Changed voice audio in guild: "${ guild.name }" to: \`${ newLang }\` `);
                            }
                        })
    
                        if (messageId) {
                            resolve({ textChannelId, messageId });
                        } else {
                            resolve(null);
                        }
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default Bot;