import pino from "pino";
import path from "path";

export default (name) => {
  const logPath = path.resolve("logs", "bots");

  const generalLogPath = `${logPath}/${name}.log`; // General log file for the bot
  const errorLogPath = `${logPath}/${name}-errors.log`; // Warnings and errors for the bot

  const streams = [
    { stream: pino.destination(generalLogPath) },
    {
      level: "warn",
      stream: pino.destination(errorLogPath),
    },
  ];
  
  const logger = pino(
    {
      level: "info", // Default log level
      base: undefined, // Remove default fields like pid and hostname
    },
    pino.multistream(streams)
  );

  return logger;
};
