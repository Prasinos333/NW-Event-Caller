import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import logger from "../util/Logger.js";
import path from "path";

const data = new SlashCommandBuilder()
    .setName('voiceraffle')
    .setDescription(`Chooses random users from your current voice channnel`)
    .addIntegerOption(option =>
        option.setName('integer')
            .setDescription('Number of users to return')
            .setRequired(true)
        ); 
    
async function execute(interaction) {
    // await interaction.deferReply({ ephemeral: true }); 
    const EventLog = logger(`${ path.resolve('logs', 'bots') }/Events.log`);
    const voiceChannel = interaction.member?.voice?.channel;
    const textChannel = interaction.channel;

    if(!voiceChannel) {
        return interaction.reply({ content: 'Error: You are not currently in a voice channel.', ephemeral: true });
    }

    const number = interaction.options.getInteger('number');

    if(number <= 0) {
        return interaction.reply({ content: 'Error: Number must be positive', ephemeral: true });
    }

    const membersArray = Array.from(voiceChannel.members.values());
    const nonBotMembers = membersArray.filter(member => !member.user.bot);

    if(number >= nonBotMembers.length) {
        return interaction.reply({ content: 'Error: Cannot be equal to or greater than amount in channel excluding bots.', ephemeral: true });
    }

    const memberArray = [...nonBotMembers];
    const RIGGED_ID = process.env.RIGGED_ID;
    let title = `${ number } Random Member(s)`;

    // Shuffle the array using the Fisher-Yates algorithm
    for (let i = number; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [memberArray[i], memberArray[randomIndex]] = [memberArray[randomIndex], memberArray[i]];

        if(memberArray[i].id == RIGGED_ID) {
            title = `${ number } Rigged Result(s)`;
        }
    }

    const randomMembers = memberArray.slice(0, number);
    
    const VC_CategoryName = voiceChannel.parent.name ?? "No Category";
    const TC_CategoryName = textChannel.parent.name ?? "No Category";

    const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor('#0099ff') // Change the color as needed
        .setDescription(randomMembers.map(member => `• <@${member.id}>`).join('\n'));
    
    interaction.reply({ embeds: [embed], ephemeral: false });
    const guild_name = interaction.member.guild.name;
    EventLog.log(`Raffle completed. Guild: "${ guild_name }" | Text channel: "${ textChannel.name }" in "${ TC_CategoryName }" | Voice channel: "${ voiceChannel.name }" in "${ VC_CategoryName }"`);
}

export {
    data,
    execute
}
