const data = {
    name: "addcaller",
    description: "Adds a bot caller to your current voice channel",
    options: [
        {
            name: "type", // 
            description: "The type of caller bot to add",
            type: 3,
            required: true,
            choices: [
                {
                    name: "Invasion",
                    value: "invasion"
                },
                {
                    name: "Respawns",
                    value: "war"
                },

            ]
        }
    ]
}

async function execute(interaction) {
    const voiceChannel = interaction.member?.voice?.channel;
    const callerType = interaction.options.getString('type');

    if (!callerType) {
        return interaction.reply({ content: 'Error: Unable to retrieve bot caller type.', ephemeral: true });
    }

    if(!voiceChannel) {
        return interaction.reply({ content: 'Error: You are not currently in a voice channel.', ephemeral: true });
    }

    if (!voiceChannel.viewable) {
        return interaction.reply({ content: "Error: Lacking 'View Channel' permission.", ephemeral: true });
    }

    if (!voiceChannel.joinable) {
        return interaction.reply({ content: "Error: Lacking 'Connect Channel' permission.", ephemeral: true });
    }

    if (voiceChannel.full) {
        return interaction.reply({ content: "Error: Channel is full", ephemeral: true });
    }

}

export {
    data,
    execute
}