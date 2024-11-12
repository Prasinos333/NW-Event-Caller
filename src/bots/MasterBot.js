import Bot from "./Bot.js";
import { execute as voiceraffleExecute } from "../commands/voiceraffle.js"
import { execute as addcallerExecute } from "../commands/addcaller.js"
import Discord, { ActivityType, GatewayIntentBits } from "discord.js"

class MasterBot extends Bot {

    constructor({ name, token }) {
        super({ name, token });

        this.client = new Discord.Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.GuildVoiceStates
            ]
        });

        this.initialise();
    }

    initialise = () => {
        this.client.login(this.token)
            .catch(console.error);

        this.client.once('ready', () => {
            
            this.client.user.setActivity({
                name: "Slash Commands",
                type: ActivityType.Listening
            });
        });

        this.client.on('interactionCreate', async interaction => { 
            if (!interaction.isCommand()) return;
        
            const { commandName } = interaction;
        
            if (commandName === 'addcaller') { 
                await addcallerExecute(interaction);
            }
        
            if(commandName === 'voiceraffle') { 
                await voiceraffleExecute(interaction);
                const guild_name = interaction.member.guild.name;
                this.eventLog.log(`Raffle completed in guild: "${ guild_name }" for channel: "${ interaction.channel.name }" in "${ interaction.channel.parent.name }"`);
            }
        });
    }
}

export default MasterBot;