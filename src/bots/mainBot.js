import Bot from "./bot.js";
import { execute as voiceraffleExecute } from "../commands/voiceRaffle.js"
import { execute as addcallerExecute } from "../commands/addCaller.js"
import Discord, { ActivityType, GatewayIntentBits } from "discord.js"

class MainBot extends Bot {

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
            }
        });
    }
}

export default MainBot;
