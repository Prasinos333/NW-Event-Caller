import { v4 as uuidv4 } from "uuid";
import Discord, {
  GatewayIntentBits,
  ActionRowBuilder,
  TextChannel,
  PermissionsBitField,
} from "discord.js";
import logger from "../util/logger.js";
import timer from "../util/timer.js";
import {
  joinVoiceChannel,
  VoiceConnectionStatus,
  getVoiceConnection,
} from "@discordjs/voice";
import WarHandler from "../handlers/warHandler.js";
import InvasionHandler from "../handlers/invasionHandler.js";
import {
  stopButton,
  langButton,
  settingsButton,
  waveButton,
} from "../util/buttons.js";

class Bot {
  constructor({ name, color, token }) {
    this.client = new Discord.Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });

    this._name = name;
    this._token = token;
    this._color = color;
    this.uId = uuidv4();
    this._logger = logger(name);
    this._eventLog = logger("Events");

    this._initialize();
  }

  /**
   * Initalizes the bot and sets up the event listeners.
   * Logs once the bot is ready.
   * Stops timer if the bot is moved to another channel.
   */
  _initialize() {
    this.client.login(this._token).catch(console.error);

    this.client.once("clientReady", () => {
      this._logger.info("Client is ready.");
    });

    this.client.on("voiceStateUpdate", (oldState, newState) => {
      if (oldState.member && oldState.member.user.id === this.client.user?.id) {
        const oldId = oldState.channelId;
        const newId = newState.channelId;

        if (oldId && newId && oldId !== newId) {
          this._logger.warn("Bot moved voice channels. Stopping...");
          const handler = timer.getHandler(this._name, oldState.guild.id);
          handler.stop();
        }
      }
    });
  }

  /**
   * Checks if the bot is available for the given server.
   *
   * @param {snowflake} guildId
   * @returns {boolean} - True if the bot is available, false otherwise.
   */
  isAvailable(guildId) {
    const guild = this.client.guilds.cache.get(guildId);

    if (!guild) {
      this._eventLog.warn(
        `"${this._name}" not in server for guild: ${guildId}`
      );
      return false;
    }

    const connection = getVoiceConnection(guildId, this.uId);

    if (
      connection &&
      connection.state &&
      connection.state.status !== VoiceConnectionStatus.Destroyed &&
      connection.state.status !== VoiceConnectionStatus.Disconnected &&
      connection.joinConfig.guildId === guildId
    ) {
      return false;
    }

    return true;
  }

  /**
   * Checks if the bot has the necessary permissions in the given channel.
   *
   * @param {*} channel - The channel to check permissions for.
   * @returns {boolean} - True if the bot has permissions, false otherwise.
   */
  async hasPerms(channel) {
    try {
      const guild = channel.guild;
      await guild.members.fetch();
      const botMember = guild.members.cache.get(this.client.user.id);
      const botPermissions = botMember.permissionsIn(channel);

      if (botPermissions) {
        const hasViewAndSendPermissions = botPermissions.has([
          PermissionsBitField.Flags.ViewChannel,
          PermissionsBitField.Flags.SendMessages,
          PermissionsBitField.Flags.Connect,
        ]);
        return hasViewAndSendPermissions;
      } else {
        const categoryName = channel.parent.name ?? "No Category";
        this._eventLog.error({
          message: `Unable to retrieve permissions`,
          guild: guild.name,
          channelName: channel.name,
          category: categoryName
        });
        return false;
      }
    } catch (error) {
      this._eventLog.error(`Error checking permissions:`, error);
      return false;
    }
  }

  /**
   * Creates the voice connection and handler for the event.
   *
   * @param {object} interaction - The interaction object from Discord.
   * @returns {Promise<void>} - Void
   */
  async eventCall(interaction, voiceChannel) {
    const callerType = interaction.options.getString("type");
    const textChannelId = interaction.channelId;
    const voiceChannelId = voiceChannel?.id;
    const voiceChannelName = voiceChannel?.name;
    const guildId = interaction.guildId;
    const guild = await this.client.guilds.fetch(guildId);
    const guildName = interaction.member.guild.name;
    const userId = interaction.user.id;
    const botData = { name: this._name, uId: this.uId, color: this._color };
    let handler = null;
    let embed = null;

    if (!guild) {
      this._eventLog.error(`Failed to fetch guild:`, guildId);
      return;
    }

    const VC_CategoryName = voiceChannel.parent.name ?? "No Category";
    this._logger.info({
      action: "Join Voice Channel",
      voiceChannel: voiceChannelName,
      category: VC_CategoryName,
      guild: guildName
    });

    const connection = joinVoiceChannel({
      channelId: voiceChannelId,
      guildId: guildId,
      adapterCreator: guild.voiceAdapterCreator,
      group: this.uId,
    });

    connection.on("error", (error) => {
      this._logger.error(`Voice connection error:`, error);
      connection.destroy();
      if (handler) handler.stop();
      return;
    });

    connection.once(VoiceConnectionStatus.Ready, async () => {
      switch (callerType) {
        case "war":
          handler = new WarHandler(botData, userId, voiceChannel);
          embed = handler.createEmbed();
          break;
        case "invasion":
          handler = new InvasionHandler(botData, userId, voiceChannel);
          embed = handler.createEmbed();
          break;
      }

      const messageData = await this._sendMessage(
        textChannelId,
        callerType,
        embed
      );
      handler.messageData = messageData;
      handler.subscribeConnection(connection);
      handler.start();
      return;
    });
  }

  /**
   * Creates and sends buttons with an embed in a specified text channel based on the event type.
   *
   * @param {snowflake} textChannelId - The ID of the text channel to send buttons in.
   * @param {string} type - The type of event (e.g., "war" or "invasion").
   * @param {object} embed - The embed object to send with the buttons.
   * @returns {object|null} - The channel and message objects if successful, null otherwise.
   */
  async _sendMessage(textChannelId, type, embed) {
    try {
      const channel = await this.client.channels.fetch(textChannelId);
      if (!(channel instanceof TextChannel)) return null;

      const categoryName = channel.parent?.name ?? "No Category";
      this._logger.info({
        action: "Send Message",
        message: "Creating buttons",
        channel: channel.name,
        category: categoryName,
      });

      const buttons = [stopButton, langButton];

      if (type === "war") {
        buttons.push(waveButton);
      } else if (type === "invasion") {
        buttons.push(settingsButton);
      }

      const message = await channel.send({
        embeds: [embed],
        components: [new ActionRowBuilder().addComponents(...buttons)],
      });

      return { channel: channel, message: message };
    } catch (error) {
      this._logger.error(`Error while creating buttons:`, error);
      return null;
    }
  }
}

export default Bot;
