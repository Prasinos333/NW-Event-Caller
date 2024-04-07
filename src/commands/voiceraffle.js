import { EmbedBuilder, SlashCommandBuilder } from "discord.js";


const data = new SlashCommandBuilder()
    .setName('voiceraffle')
    .setDescription(`Chooses random users from your current voice channnel`)
    .addIntegerOption(option =>
        option.setName('integer')
            .setDescription('Number of users to return')
            .setRequired(true)
        ); 
    
async function execute(interaction) {
    await interaction.deferReply({ ephemeral: true }); 

    const voiceChannel = interaction.member?.voice?.channel;

    if(!voiceChannel) {
        return interaction.editReply({ content: 'Error: You are not currently in a voice channel.', ephemeral: true });
    }

    const number = interaction.options.getInteger('number');

    if(number <= 0) {
        return interaction.editReply({ content: 'Error: Number must be positive', ephemeral: true });
    }

    const membersArray = Array.from(voiceChannel.members.values());
    const nonBotMembers = membersArray.filter(member => !member.user.bot);

    if(number >= nonBotMembers.length) {
        return interaction.editReply({ content: 'Error: Cannot be equal to or greater than amount in channel excluding bots.', ephemeral: true });
    }

    const randomMembers = [];

    while(randomMembers.length < number) {
        const randomIndex = Math.floor(Math.random() * nonBotMembers.length);
        randomMembers.push(nonBotMembers.splice(randomIndex, 1)[0]);
    }

    const RIGGED_ID = process.env.RIGGED_ID;
    let title = `${ number } Random Members`;
    
    if(interaction.user.id === RIGGED_ID && RIGGED_ID in randomMembers) { 
        title = "Rigged Raffle Results";
    } 
    
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor('#0099ff') // Change the color as needed
        .setDescription(randomMembers.map(member => `• <@${member.id}>`).join('\n'));
    
    interaction.editReply({ content: `Raffle Completed`});
    interaction.reply({ embeds: [embed], ephemeral: false });
}

export {
    data,
    execute
}