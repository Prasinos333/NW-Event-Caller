import {
  MessageFlags,
  SlashCommandBuilder,
  VoiceChannel,
  InteractionContextType,
} from "discord.js";
import logger from "../util/logger.js";
import path from "path";
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
  const EventLog = logger(`${path.resolve("logs", "bots")}/Events.log`);

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
      EventLog.warn(
        `Not enough bots! Guild: "${guildName}" | Voice channel: "${voiceChannel.name}" in "${VC_CategoryName}"`
      );
      return interaction.editReply({
        content: "**Error:** *No available bots. Add more:* https://github.com/Prasinos333/NW-Event-Caller",
      });
    }

    const hasTextPerms = await availableBot.hasPerms(textChannel);
    const hasVoicePerms = await availableBot.hasPerms(voiceChannel);

    if (!hasTextPerms) {
      EventLog.warn(
        `"${availableBot._name}" doesn't have the proper perms for text channel: "${textChannel.name}" in "${TC_CategoryName}" for guild: "${guildName}"`
      );
      return interaction.editReply({
        content: `**Error:** *\`${availableBot.client.user.username}\` doesn't have proper permissions for this text channel.*`,
      });
    } else if (!hasVoicePerms) {
      EventLog.warn(
        `"${availableBot._name}" doesn't have the proper perms for voice channel: "${voiceChannel.name}" in "${VC_CategoryName}" for guild: "${guildName}"`
      );
      return interaction.editReply({
        content: `**Error:** *\`${availableBot.client.user.username}\` doesn't have proper permissions for the voice channel.*`,
      });
    } else {
      availableBot.eventCall(interaction, voiceChannel);
      EventLog.log(
        `"${availableBot._name}" calling '${callerType}' | Guild: "${guildName}" | Voice channel: "${voiceChannel.name}" in "${VC_CategoryName}" | Text channel: "${textChannel.name}" in "${TC_CategoryName}"`
      );
      await interaction.deleteReply();
      return interaction.followUp({
        content: `<@${availableBot.client.user.id}> calling \`${callerType}\` in \`${voiceChannel.name}\` for \`${VC_CategoryName}\``,
      });
    }
  } catch (error) {
    if (error.code === 10062) {
      EventLog.warn("Interaction no longer valid. Skipping.");
    } else {
      EventLog.error("Error executing addcaller command:", error);
    }

    try {
      await interaction.editReply({
        content: "*An error occurred while executing the command.* Please try again later.",
      });
    } catch (editError) {
      EventLog.error("Error editing the reply:", editError);
    }
  }
}

export { data, execute };
