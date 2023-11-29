import dotenv from "dotenv"
import path from "path";
import Bot from "./bots/Bot.js";
import MasterBot from "./bots/MasterBot.js";

dotenv.config({ path: path.resolve('.env'), override: true });

const duration = 1000;
const botsConfig = JSON.parse(process.env.BOTS);
const masterBotConfig = JSON.parse(process.env.MASTER_BOT);
const createdBots = [];

// Create an array of promises for each Bot creation
const botPromises = botsConfig.map((props, index) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newBot = new Bot(props);
            createdBots.push(newBot);
            resolve();
        }, index * duration);
    });
});

// Wait for all promises to resolve before creating MasterBot
Promise.all(botPromises).then(() => {
    const { name, token } = masterBotConfig;
    
    new MasterBot({
        name: name,
        token: token,
        createdBots: createdBots,
    });
});
