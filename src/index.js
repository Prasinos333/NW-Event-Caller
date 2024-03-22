import dotenv from "dotenv"
import path from "path";
import Bot from "./bots/Bot.js";
import MasterBot from "./bots/MasterBot.js";
import Database from "./util/Database.js";

dotenv.config({ path: path.resolve('.env'), override: true });

const duration = 1000;
const botsConfig = JSON.parse(process.env.BOTS);
const masterBotConfig = JSON.parse(process.env.MASTER_BOT);
const mySqlUrl = process.env.SQL_URL;

export const createdBots = [];
export const db = new Database(mySqlUrl);

const createMasterBot = () => {
    const masterBot = new MasterBot(masterBotConfig);
    createdBots.push(masterBot);
};

// Then, create each Bot sequentially
const createBotsSequentially = async () => {
    for (let i = 0; i < botsConfig.length; i++) {
        await new Promise(resolve => {
            setTimeout(() => {
                const newBot = new Bot(botsConfig[i]);
                createdBots.push(newBot);
                resolve();
            }, i * duration);
        });
    }
};

// Main function to control the flow
const initializeBots = async () => {
    createMasterBot();
    await createBotsSequentially();
};

initializeBots();
