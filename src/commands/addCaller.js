import {
  MessageFlags,
  SlashCommandBuilder,
  VoiceChannel,
  InteractionContextType,
} from "discord.js";
import logger from "../util/logger.js";
import { getVoiceConnection } from "@discordjs/voice";
import Bot from "../bots/basicBot.js";
import { createdBots } from "../index.js";

const data = new SlashCommandBuilder()
  .setName("addcaller")
  .setDescription(`Adds a bot caller to your current voice channel`)
  .addStringOption((option) =>
    option
      .setName("type")
      .setDescription("The type of caller bot to add")
      .setRequired(true)
      .addChoices(
        { name: "Invasion", value: "invasion" },
        { name: "War", value: "war" }
      )
  )
  .setContexts(InteractionContextType.Guild);

/**
 * Command to add a bot caller to the current voice channel.
 *
 * @param {object} interaction - The interaction object.
 * @returns - None. Replies with a message.
 */
async function execute(interaction) {
  const eventLog = logger("Events");

  try {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const voiceChannel = interaction.member?.voice?.channel;
    const textChannel = interaction.channel;
    const guildName = interaction.member.guild.name;

    if (textChannel instanceof VoiceChannel) {
      return interaction.editReply({
        content: "Error: Cannot start in voice channel chat.",
      });
    }

    if (!voiceChannel) {
      return interaction.editReply({
        content: "Error: You are not currently in a voice channel.",
      });
    }

    if (!voiceChannel.viewable) {
      return interaction.editReply({
        content: "Error: Lacking `View Channel` permission.",
      });
    }

    if (!voiceChannel.joinable) {
      return interaction.editReply({
        content: "Error: Lacking `Connect Channel` permission.",
      });
    }

    if (voiceChannel.full) {
      return interaction.editReply({
        content: "Error: Channel is full.",
      });
    }

    const callerType = interaction.options.getString("type");

    if (!callerType) {
      return interaction.editReply({
        content: "Error: Unable to retrieve bot caller type.",
      });
    }

    let hasBot = false;
    for (const bot of createdBots) {
      const connection = getVoiceConnection(voiceChannel.guild.id, bot.uId);
      if (connection?.joinConfig.channelId === voiceChannel.id) {
        hasBot = true;
        break;
      }
    }

    if (hasBot) {
      return interaction.editReply({
        content:
          "**Error:** *Voice channel currently has an active bot. Please `End` it before adding a new one.*",
      });
    }

    let availableBot = null;
    for (const bot of createdBots) {
      if (bot instanceof Bot && bot.isAvailable(interaction.guildId)) {
        availableBot = bot;
        break;
      }
    }

    const VC_CategoryName = voiceChannel.parent?.name ?? "No Category";
    const TC_CategoryName = textChannel.parent?.name ?? "No Category";

    if (!availableBot) {
      eventLog.warn({
        msg: "Not enough bots",
        guild: guildName,
        voiceChannel: voiceChannel.name,
        category: VC_CategoryName
      });

      return interaction.editReply({
        content: "**Error:** *No available bots. Add more:* https://github.com/Prasinos333/NW-Event-Caller",
      });
    }

    const hasTextPerms = await availableBot.hasPerms(textChannel);
    const hasVoicePerms = await availableBot.hasPerms(voiceChannel);

    if (!hasTextPerms) {
      eventLog.warn({
        msg: "Improrer Text permissions",
        bot: availableBot._name,
        guild: guildName,
        textChannel: textChannel.name,
        category: TC_CategoryName
      });

      return interaction.editReply({
        content: `**Error:** *\`${availableBot.client.user.username}\` doesn't have proper permissions for this text channel.*`,
      });
    } else if (!hasVoicePerms) {

      eventLog.warn({
        msg: "Improrer Voice permissions",
        bot: availableBot._name,
        guild: guildName,
        textChannel: voiceChannel.name,
        category: VC_CategoryName
      });

      return interaction.editReply({
        content: `**Error:** *\`${availableBot.client.user.username}\` doesn't have proper permissions for the voice channel.*`,
      });
    } else {
      availableBot.eventCall(interaction, voiceChannel);
      eventLog.info({
        action: "Command Executed",
        msg: "/addcaller",
        bot: availableBot._name,
        type: callerType,
        guild: guildName,
        voiceChannel: voiceChannel.name,
        voiceCategory: VC_CategoryName,
        textChannel: textChannel.name,
        textCategory: TC_CategoryName,
      });
      return interaction.editReply({
        content: `<@${availableBot.client.user.id}> calling \`${callerType}\` in \`${voiceChannel.name}\` for \`${VC_CategoryName}\``,
      });
    }
  } catch (error) {
    if (error.code === 10062) {
      eventLog.error("Interaction no longer valid. Skipping.");
    } else {
      eventLog.error({
        msg: "Error executing addCaller command",
        err: error
      });
    }

    try {
      await interaction.editReply({
        content: "*An error occurred while executing the command.* Please try again later.",
      });
    } catch (editError) {
      eventLog.error({
        msg: "Error editing reply to addcaller interaction",
        err: editError
      });
    }
  }
}

export { data, execute };
