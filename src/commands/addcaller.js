import { SlashCommandBuilder, VoiceChannel } from "discord.js";
import logger from "../util/Logger.js";
import { createdBots } from "..";

const data = new SlashCommandBuilder()
    .setName('addcaller')
    .setDescription(`Adds a bot caller to your current voice channel`)
    .setStringOptions(option =>
        option.setName(`type`)
            .setDescription(`The type of caller bot to add`)
            .setRequired(true)
            .addChoices(
                { name: "Invasion", value: "invasion" },
                { name: "War", value: "war" },
            )
        );

async function execute(interaction) {
    await interaction.deferReply({ ephemeral: true }); 

    const voiceChannel = interaction.member?.voice?.channel;
    const textChannel = interaction.channel;
    const guild_name = interaction.member.guild.name;

    if(textChannel instanceof VoiceChannel) {
        return interaction.editReply({ content: 'Error: Cannot start in voice channel chat.', ephemeral: true });
    }

    if(!voiceChannel) {
        return interaction.editReply({ content: 'Error: You are not currently in a voice channel.', ephemeral: true });
    }

    if (!voiceChannel.viewable) {
        return interaction.editReply({ content: "Error: Lacking 'View Channel' permission.", ephemeral: true });
    }

    if (!voiceChannel.joinable) {
        return interaction.editReply({ content: "Error: Lacking 'Connect Channel' permission.", ephemeral: true });
    }

    if (voiceChannel.full) {
        return interaction.editReply({ content: "Error: Channel is full", ephemeral: true });
    }

    const callerType = interaction.options.getString('type');

    if (!callerType) {
        return interaction.editReply({ content: 'Error: Unable to retrieve bot caller type.', ephemeral: true }); 
    }

    if(this.hasBot(voiceChannel)) {
        return interaction.editReply({ content: 'Error: Voice channel currently has active bot. Press stop to change type', ephemeral: true });
    }
    
    const EventLog = logger(`${ path.resolve('logs') }/${ Events }.log`);
    const availableBot = this.getAvailableBot(interaction.guildId);
    
    if (!availableBot) {
        EventLog.warn(`Not enough bots! Bot request in "${ voiceChannel.name }"`);
        return interaction.editReply({ content: 'Error: No available bots.', ephemeral: true });
    }

    const hasPerms = await availableBot.hasPerms(textChannel);

    if (hasPerms) {
        availableBot.eventCall(callerType, interaction);
        EventLog.log(`"${ availableBot.name }" calling '${ callerType }' in voice channel "${ voiceChannel.name }" for guild "${ guild_name }"`);
        return interaction.editReply({content: `Adding \`${ availableBot.client.user.username }\` to \`${ voiceChannel.name }\``, ephemeral: true});  
    } else {
        return interaction.editReply({ content: `Error: \'${ availableBot.client.user.username }\' can't send messages to this channel.`, ephemeral: true });
    }
}

getAvailableBot = (currentGuildId) => {
    for (const bot of createdBots) {
        if(bot.isAvailable(currentGuildId)) {
            return bot;
        } 
    }

    return null;
}

hasBot = (voiceChannel) => { 
    for (const bot of createdBots) {
        const connection = getVoiceConnection(voiceChannel.guild.id, bot.ID);
        if(connection?.joinConfig.channelId === voiceChannel.id) {
            return true;
        }
    }

    return false;
}

export {
    data,
    execute
}