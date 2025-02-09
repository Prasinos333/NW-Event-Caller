import path from "path";
import Bot from "../bots/Bot.js";
import { SlashCommandBuilder, VoiceChannel } from "discord.js";
import logger from "../util/logger.js";
import { createdBots } from "../index.js";
import { getVoiceConnection } from "@discordjs/voice";

const data = new SlashCommandBuilder()
    .setName('addcaller')
    .setDescription(`Adds a bot caller to your current voice channel`)
    .addStringOption(option =>
        option.setName('type')
            .setDescription('The type of caller bot to add')
            .setRequired(true)
            .addChoices(
                { name: "Invasion", value: "invasion" },
                { name: "War", value: "war" },
            )
    );

async function execute(interaction) {
    const EventLog = logger(`${path.resolve('logs', 'bots')}/Events.log`);

    try {
        // await interaction.deferReply({ ephemeral: true });
        const voiceChannel = interaction.member?.voice?.channel;
        const textChannel = interaction.channel;
        const guildName = interaction.member.guild.name;

        if (textChannel instanceof VoiceChannel) {
            return interaction.reply({ content: 'Error: Cannot start in voice channel chat.', ephemeral: true });
        }

        if (!voiceChannel) {
            return interaction.reply({ content: 'Error: You are not currently in a voice channel.', ephemeral: true });
        }

        if (!voiceChannel.viewable) {
            return interaction.reply({ content: "Error: Lacking `View Channel` permission.", ephemeral: true });
        }

        if (!voiceChannel.joinable) {
            return interaction.reply({ content: "Error: Lacking `Connect Channel` permission.", ephemeral: true });
        }

        if (voiceChannel.full) {
            return interaction.reply({ content: "Error: Channel is full.", ephemeral: true });
        }

        const callerType = interaction.options.getString('type');

        if (!callerType) {
            return interaction.reply({ content: 'Error: Unable to retrieve bot caller type.', ephemeral: true });
        }

        let hasBot = false;
        for (const bot of createdBots) {
            const connection = getVoiceConnection(voiceChannel.guild.id, bot.ID);
            if (connection?.joinConfig.channelId === voiceChannel.id) {
                hasBot = true;
                break;
            }
        }

        if (hasBot) {
            return interaction.reply({ content: 'Error: Voice channel currently has active bot. Press stop to change type', ephemeral: true });
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
            EventLog.warn(`Not enough bots! Guild: "${guildName}" | Voice channel: "${voiceChannel.name}" in "${VC_CategoryName}"`);
            return interaction.reply({ content: 'Error: No available bots.', ephemeral: true });
        }

        const hasTextPerms = await availableBot.hasPerms(textChannel);
        const hasVoicePerms = await availableBot.hasPerms(voiceChannel);

        if (!hasTextPerms) {
            EventLog.warn(`"${availableBot.name}" doesn't have the proper perms for text channel: "${textChannel.name}" in "${TC_CategoryName}" for guild: "${guildName}"`);
            return interaction.reply({ content: `Error: \`${availableBot.client.user.username}\` doesn't have proper permissions for this text channel.`, ephemeral: true });
        } else if (!hasVoicePerms) {
            EventLog.warn(`"${availableBot.name}" doesn't have the proper perms for voice channel: "${voiceChannel.name}" in "${VC_CategoryName}" for guild: "${guildName}"`);
            return interaction.reply({ content: `Error: \`${availableBot.client.user.username}\` doesn't have proper permissions for the voice channel.`, ephemeral: true });
        } else {
            availableBot.eventCall(callerType, interaction);
            EventLog.log(`"${availableBot.name}" calling '${callerType}' | Guild: "${guildName}" | Voice channel: "${voiceChannel.name}" in "${VC_CategoryName}" | Text channel: "${textChannel.name}" in "${TC_CategoryName}"`);
            return interaction.reply({ content: `<@${availableBot.client.user.id}> calling \`${callerType}\` in \`${voiceChannel.name}\` for \`${VC_CategoryName}\``, ephemeral: false });
        }
    } catch (error) {
        EventLog.error('Error executing addcaller command:', error);
        interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
    }
}

export {
    data,
    execute
}
