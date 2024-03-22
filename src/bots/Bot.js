import path from "path";
import { v4 as uuidv4 } from "uuid";
import logger from "../util/Logger.js";
import Timer from "../util/Timer.js";
import { db } from "../index.js";
import { invasionOptions, warOptions } from "../config.js";
import Discord, { GatewayIntentBits, ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, TextChannel, ButtonStyle, PermissionsBitField, ComponentType } from "discord.js";
import { joinVoiceChannel, VoiceConnectionStatus, getVoiceConnection } from "@discordjs/voice";

class Bot
{
    constructor({ name, token }) {
        this.uId = uuidv4();
        
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
        this.timers = [];
        this.logger = logger(`${ path.resolve('logs', 'bots') }/${ name }.log`);
        this.eventLog = logger(`${ path.resolve('logs', 'bots') }/Events.log`);

        this.initialize();
    }
    
    initialize() { 
        this.client.login(this.token).catch(console.error);

        this.client.once('ready', () => {
            this.logger.info('Client is ready.');            
        });

        this.client.on('voiceStateUpdate', (oldState, newState) => { 
            if (oldState.member && oldState.member.user.id === this.client.user.id) {
                const oldId = oldState.channelId;
                const newId = newState.channelId;

                if (oldId && newId && oldId !== newId) {
                    this.logger.warn('Bot moved voice channels. Stopping...');
                    const current = this.getTimer(oldState.guild.id);
                    if(current) {
                        this.deleteButton(current.timer.buttonData);
                    }
                    this.stopCommand(newState.guild.id);
                }
            }
        });
    }

    isAvailable(guildId) {
        const guild = this.client.guilds.cache.get(guildId);

        if (!guild) {
            this.eventLog.warn(`\'${ this.name }\' not in server for guild id: \'${ guildId }\'`);
            return false;
        }

        const connection = getVoiceConnection(guildId, this.uId);

        if (
            connection && connection.state &&
            (connection.state.status !== VoiceConnectionStatus.Destroyed ||
                connection.state.status !== VoiceConnectionStatus.Disconnected) &&
            connection.joinConfig.guildId === guildId
        ) {
            return false;
        }

        return true;
    }
    
    async hasPerms(Channel) { 
        try {
            const guild = Channel.guild;
            await guild.members.fetch();
            const botMember = guild.members.cache.get(this.client.user.id);
            const botPermissions = botMember.permissionsIn(Channel);
    
            if (botPermissions) {
                const hasViewAndSendPermissions = botPermissions.has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.Connect]);
                return hasViewAndSendPermissions;
            } else {
                this.eventLog.error(`Unable to retrieve permissions in channel: \'${ textChannel.id }\' for "${ guild.name }"`);
                return false;
            }
        } catch (error) {
            this.eventLog.error(`Error checking permissions: ${ error }`);
            return false;
        }
    }

    getTimer(guildId) {
        const timer = this.timers.find((timer) => timer.guildId === guildId);
        return timer;
    }

    async removeTimer(guildId) 
    {
        this.getTimer(guildId);
        if(current.timer.modifiedConfig) {
            const lang = current.timer.lang;
            const settings = current.timer.setting;
            const userId = current.timer.userId;
            db.addConfig(userId, lang, settings);
        }
        current.timer.clearTimerInterval();
        this.timers = this.timers.filter((timer) => timer.guildId !== guildId);
    }

    stopCommand(guildId, userID = 0) {
        const guild = this.client.guilds.cache.get(guildId);
        switch(userID) {
            case 0:
                this.logger.info(`Stop command launched for guild: "${ guild.name }"`);
                break;
            default:
                this.logger.warn(`Stop command launched for guild: "${ guild.name }" by user: \'${ userID }\'`);
                break;
        }
        
        const connection = getVoiceConnection(guildId, this.uId);

        if (connection) {
            connection.destroy();
            this.removeTimer(guildId);
        }
    }

    handleErrors(error) {
        switch(error) {
            case 10062:
                this.logger.error(`Interaction reply error: 'Unknown interaction'`);
                break;
            case 10008:
                this.logger.error(`Message deletion error: 'Unknown message'`);
            default:
                this.logger.error('New Error:', error);
        }
    }

    async deleteButton(buttonData) {
        if(buttonData) {
            const { textChannelId, messageId } = buttonData;

            if (textChannelId && messageId) {
                const channel = await this.client.channels.fetch(textChannelId);
    
                if (channel instanceof TextChannel) {
                    const message = await channel.messages.fetch(messageId)
                        .catch((err) => {
                        if (err.httpStatus === 404) {
                            this.logger.warn('Button already deleted');
                        } else {
                            this.logger.error(`Error fetching message: \'${ messageId }\'`, err);
                        }
                    });

                    if (message) {
                        await message.delete()
                            .then(() => this.logger.info('Button deleted successfully'))
                            .catch((error) => this.handleErrors(error));
                        }
                    }
            }
        }  
    }

    async createButtons(textChannelId, type) { 
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

                        let additionalButton;
                        let selectOptions;

                        switch (type) {
                            case "war":
                                additionalButton = new ButtonBuilder()
                                    .setCustomId('waveSwitch')
                                    .setLabel('Switch Wave')
                                    .setStyle(ButtonStyle.Secondary);
                                selectOptions = warOptions;
                                break;
                            case "invasion":
                                additionalButton = new ButtonBuilder()
                                    .setCustomId(`invasionLoop`)
                                    .setLabel(`Change Setting`)
                                    .setStyle(ButtonStyle.Secondary);
                                selectOptions = invasionOptions;
                                break;
                        }

                        const configSelect = new StringSelectMenuBuilder()
                            .setCustomId('select')
                            .setPlaceholder('Change Voice')
                            .addOptions(selectOptions);
    
                        const message = await channel.send({
                            components: [
                                new ActionRowBuilder().addComponents(configSelect),
                                new ActionRowBuilder().addComponents(stopButton, additionalButton)
                            ]
                        });
    
                        messageId = message.id;
                        const collector = channel.createMessageComponentCollector();

                        collector.on('collect', async (interaction) => {
                            await interaction.deferReply({ ephemeral: true });
                            const { componentType } = interaction;
                            const guildId = interaction.guildId;
                            const current = this.getTimer(guildId);

                            switch(componentType) {
                                case ComponentType.Button:
                                    switch (interaction.customId) {
                                        case "invasionLoop":
                                            const state = current.timer.changeSetting();
                                            await interaction.editReply({content: `Changed setting to \`${ state }\``, ephemeral: true});
                                            break;
                                        case "waveSwitch":
                                            const wave = current.timer.changeWave();
                                            await interaction.editReply({content: `Changed to wave \`${ wave }\``, ephemeral: true});
                                            break;
                                        case "stop":
                                            this.stopCommand(guildId, interaction.user.id);
                                            await interaction.deleteReply().catch((err) => this.logger.error(`Error deleting reply:`, err));
                                            await message.delete() // TODO - Being called twice.
                                                    .then(() => this.logger.info('Button deleted successfully'))
                                                    .catch((err) => this.logger.error(`Error deleting message: \'${ messageId }\'`, err));
                                            break;
                                    }
                                    break;
                                case ComponentType.StringSelect:
                                    const newLang = interaction.values[0];
                                    current.timer.changeLang(newLang);

                                    await interaction.editReply({content: `Changed voice to \`${ newLang }\``, ephemeral: true});
                                    this.logger.log(`Changed voice audio in guild: "${ guild.name }" to: \`${ newLang }\``);
                                    break;
                            }
                        });
    
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
    
    async eventCall(type, interaction) { 
        const textChannelId = interaction.channelId;
        const voiceChannelId = interaction.member.voice.channel.id;
        const voiceChannelName = interaction.member.voice.channel.name;
        const guildId = interaction.guildId;
        const guildName = interaction.member.guild.name;
        const userId = interaction.user.id;
        const guild = await this.client.guilds.fetch(guildId);

        if(!db.isConnected()) {
            db.reconnect();
        }

        if (!guild) {
            this.eventLog.error(`Failed to fetch guild`);
            return;
        } 
        const timer = new Timer(this.name, guildId, userId, this); 
        this.timers.push({ guildId: guildId, timer: timer});
        this.logger.info(`Attempting to join voice channel "${ voiceChannelName }" in guild: "${ guildName }"`);

        const connection = joinVoiceChannel({
            channelId: voiceChannelId,
            guildId: guildId,
            adapterCreator: guild.voiceAdapterCreator,
            group: this.uId
        });

        connection.on(VoiceConnectionStatus.Ready, async () => {
            timer.subscribeTimer(connection);
            let buttonData;

            switch (type) {
                case 'war':
                    buttonData = await this.createButtons(textChannelId, type);
                    timer.changeButtonData(buttonData);
                    timer.callRespawns();
                    break;
                case 'invasion':
                    const options = await db.retrieveConfig(userId);
                    if(options) {
                        timer.updateConfig(options);
                    }
                    buttonData = await this.createButtons(textChannelId, type);
                    timer.changeButtonData(buttonData);
                    timer.callInvasion();
                    break;
            }
        });
    }
}

export default Bot;