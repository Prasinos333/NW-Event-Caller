import dotenv from "dotenv"; 
import path from "path";
import { glob } from "glob";
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';

dotenv.config({ path: path.resolve('.env'), override: true });

const commands = [];
const commandFiles = glob.sync("./src/commands/*.js");
const rest = new REST().setToken(process.env.TOKEN);

(async () => {
	for (const file of commandFiles) {
		const command = await import(`../../${file}`); 
		console.log(command);
		if ('data' in command && 'execute' in command) {
			commands.push(command.data);
		} else {
			console.log(`[WARNING] The command at ${file} is missing a required "data" or "execute" property.`);
		}
	}

	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();