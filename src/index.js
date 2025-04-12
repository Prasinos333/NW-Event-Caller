/* eslint-disable no-undef */
import dotenv from "dotenv";
import path from "path";
import Database from "./util/database.js";
import logger from "./util/logger.js";
import MainBot from "./bots/mainBot.js";
import Bot from "./bots/basicBot.js";

dotenv.config({ path: path.resolve(".env"), override: true });

const duration = 1000;
const botsConfig = JSON.parse(process.env.BOTS);
const mainBotConfig = JSON.parse(process.env.MASTER_BOT);
const mySqlUrl = process.env.SQL_URL;

export const createdBots = [];
export const db = new Database(mySqlUrl);
const EventLog = logger(`${path.resolve("logs", "bots")}/Events.log`);

const validateConfig = (config, configName) => {
  if (!config || typeof config !== "object" || !config.name || !config.token) {
    throw new Error(`Invalid or missing configuration for ${configName}`);
  }
};

const createMasterBot = () => {
  try {
    validateConfig(mainBotConfig, "MASTER_BOT");
    const masterBot = new MainBot(mainBotConfig);
    createdBots.push(masterBot);
  } catch (error) {
    EventLog.error("Error creating MasterBot:", error);
  }
};

const createBotsSequentially = async () => {
  for (let i = 0; i < botsConfig.length; i++) {
    try {
      validateConfig(botsConfig[i], `BOTS[${i}]`);
      await new Promise((resolve) => {
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
    createMasterBot();
    await createBotsSequentially();
  } catch (error) {
    EventLog.error("Error initializing bots:", error);
  }
};

initializeBots();
