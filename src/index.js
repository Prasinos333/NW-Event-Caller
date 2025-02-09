import dotenv from "dotenv";
import path from "path";
import Bot from "./bots/Bot.js";
import MasterBot from "./bots/MasterBot.js";
import Database from "./util/Database.js";
import logger from "./util/Logger.js";

dotenv.config({ path: path.resolve('.env'), override: true });

const duration = 1000;
const botsConfig = JSON.parse(process.env.BOTS);
const masterBotConfig = JSON.parse(process.env.MASTER_BOT);
const mySqlUrl = process.env.SQL_URL;

export const createdBots = [];
export const db = new Database(mySqlUrl);
const EventLog = logger(`${path.resolve('logs', 'bots')}/Events.log`);

const validateConfig = (config, configName) => {
    if (!config || !Array.isArray(config) || config.length === 0) {
        throw new Error(`Invalid or missing configuration for ${configName}`);
    }
};

const createMasterBot = () => {
    try {
        const masterBot = new MasterBot(masterBotConfig);
        createdBots.push(masterBot);
    } catch (error) {
        EventLog.error('Error creating MasterBot:', error);
    }
};

const createBotsSequentially = async () => {
    for (let i = 0; i < botsConfig.length; i++) {
        try {
            await new Promise(resolve => {
                setTimeout(() => {
                    const newBot = new Bot(botsConfig[i]);
                    createdBots.push(newBot);
                    resolve();
                }, i * duration);
            });
        } catch (error) {
            EventLog.error(`Error creating bot at index ${i}:`, error);
        }
    }
};

const initializeBots = async () => {
    try {
        validateConfig(botsConfig, 'BOTS');
        validateConfig(masterBotConfig, 'MASTER_BOT');
        createMasterBot();
        await createBotsSequentially();
    } catch (error) {
        EventLog.error('Error initializing bots:', error);
    }
};

initializeBots();
