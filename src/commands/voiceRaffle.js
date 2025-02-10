import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import logger from "../util/logger.js";
import path from "path";

const data = new SlashCommandBuilder()
    .setName('voiceraffle')
    .setDescription(`Chooses random users from your current voice channnel`)
    .addIntegerOption(option =>
        option.setName('count')
            .setDescription('Number of users to return')
            .setRequired(true)
    )
    .addBooleanOption(option =>
        option.setName('exclude-self')
            .setDescription('Excludes yourself from the raffle')
            .setRequired(false)
    );

async function execute(interaction) {
    const EventLog = logger(`${ path.resolve('logs', 'bots') }/Events.log`);

    try {
        // await interaction.deferReply({ ephemeral: true }); 
        const voiceChannel = interaction.member?.voice?.channel;
        const textChannel = interaction.channel;

        if(!voiceChannel) {
            return interaction.reply({ content: 'Error: You are not currently in a voice channel.', ephemeral: true });
        }

        const number = interaction.options.getInteger('count');
        const excludeSelf = interaction.options.getBoolean('exclude-self');

        if(number <= 0) {
            return interaction.reply({ content: 'Error: Number must be positive', ephemeral: true });
        }

        const membersArray = Array.from(voiceChannel.members.values());
        let nonBotMembers = membersArray.filter(member => !member.user.bot);

        if (excludeSelf) {
            nonBotMembers = nonBotMembers.filter(member => member.id !== interaction.member.id);
        }

        if(number >= nonBotMembers.length) {
            const errorMessage = excludeSelf 
                ? 'Error: Cannot be equal to or greater than amount in channel excluding yourself and bots.' 
                : 'Error: Cannot be equal to or greater than amount in channel excluding bots.';
            return interaction.reply({ content: errorMessage, ephemeral: true });
        }

        const memberArray = [...nonBotMembers];
        const RIGGED_ID = process.env.RIGGED_ID;
        let title = `${ number } Random Member(s)`;

        // Shuffle the array using the Fisher-Yates algorithm
        for (let i = memberArray.length - 1; i >= memberArray.length - number; i--) {
            const randomIndex = Math.floor(Math.random() * (i + 1));
            [memberArray[i], memberArray[randomIndex]] = [memberArray[randomIndex], memberArray[i]];

            if(memberArray[i].id == RIGGED_ID) {
                title = `${ number } Rigged Result(s)`;
            }
        }

        const randomMembers = memberArray.slice(-number);
        
        const VC_CategoryName = voiceChannel.parent.name ?? "No Category";
        const TC_CategoryName = textChannel.parent.name ?? "No Category";

        const embed = new EmbedBuilder()
            .setTitle(title)
            .setColor('#0099ff') // Change the color as needed
            .setDescription(randomMembers.map(member => `• <@${member.id}>`).join('\n'));
        
        interaction.reply({ embeds: [embed], ephemeral: false });
        const guild_name = interaction.member.guild.name;
        EventLog.log(`Raffle completed. Guild: "${ guild_name }" | Text channel: "${ textChannel.name }" in "${ TC_CategoryName }" | Voice channel: "${ voiceChannel.name }" in "${ VC_CategoryName }"`);
    } catch (error) {
        EventLog.error('Error executing voiceraffle command:', error);
        interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
    }
}

export {
    data,
    execute
}
