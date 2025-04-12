import Bot from "./basicBot.js";
import { execute as voiceraffleExecute } from "../commands/voiceRaffle.js";
import { execute as addcallerExecute } from "../commands/addCaller.js";
import { execute as allowRolesExecute } from "../commands/allowRoles.js";
import Discord, { ActivityType, GatewayIntentBits } from "discord.js";

class MainBot extends Bot {
  constructor({ name, token }) {
    super({ name, token });

    this.client = new Discord.Client({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
      ],
    });

    this.initialise();
  }

  /**
   * Initialises the bot and sets up the event listeners.
   */
  initialise = () => {
    this.client.login(this.token).catch(console.error);

    this.client.once("ready", () => {
      this.client.user.setActivity({
        name: "Slash Commands",
        type: ActivityType.Listening,
      });
    });

    this.client.on("interactionCreate", async (interaction) => {
      if (!interaction.isCommand()) return;

      const { commandName } = interaction;

      if (commandName === "addcaller") {
        await addcallerExecute(interaction);
      }

      if (commandName === "voiceraffle") {
        await voiceraffleExecute(interaction);
      }

      if (commandName === "allowroles") {
        await allowRolesExecute(interaction);
      }
    });
  };
}

export default MainBot;
