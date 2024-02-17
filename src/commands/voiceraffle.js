import { EmbedBuilder } from "discord.js";


const data = {
    name: "voiceraffle",
    description: "Chooses random users from your current voice channel.",
    options: [
        {
            name: "number",
            description: "Number of users to return",
            type: 4,
            required: true
        }
    ]
}  
    
async function execute(interaction) { 
    const voiceChannel = interaction.member?.voice?.channel;

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

    const randomMembers = [];

    for (let i = 0; i < Math.min(number, nonBotMembers.length); i++) {
        const randomIndex = Math.floor(Math.random() * nonBotMembers.length);
        randomMembers.push(nonBotMembers.splice(randomIndex, 1)[0]);
    }

    const RIGGED_ID = process.env.RIGGED_ID;
    let title = `${number} Random Members`;
    
    if(interaction.user.id === RIGGED_ID && RIGGED_ID in randomMembers) { 
        title = "Rigged Raffle Results";
    } 
    
    const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor('#0099ff') // Change the color as needed
        .setDescription(randomMembers.map(member => `• <@${member.id}>`).join('\n'));

    interaction.reply({ embeds: [embed] });
}

export {
    data,
    execute
}