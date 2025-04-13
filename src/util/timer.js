import logger from "../util/logger.js";
import path from "path";

class Timer {
  constructor() {
    this._eventLog = logger(`${path.resolve("logs", "bots")}/Events.log`);
    this._subscribers = new Map(); // Use a Map to store handlers with a unique key
    this._interval = null;
    this._lastUpdateTime = null;
  }

  /**
   * Subscribes a handler to the timer.
   * Starts the timer if this is the first subscriber.
   *
   * @param {string} botName - The name of the bot.
   * @param {string} guildId - The ID of the guild.
   * @param {Handler} handler - The handler to subscribe.
   */
  subscribe(botName, guildId, handler) {
    const key = this._generateKey(botName, guildId);

    if (!this._subscribers.has(key)) {
      this._subscribers.set(key, handler);
    }

    if (this._subscribers.size === 1) {
      this._start();
    }
  }

  /**
   * Generates a unique key for a handler based on the bot's name and guild ID.
   *
   * @param {string} botName - The name of the bot.
   * @param {string} guildId - The ID of the guild.
   * @returns {string} - The unique key for the handler.
   */
  _generateKey(botName, guildId) {
    return `${botName}:${guildId}`;
  }

  /**
   * Starts the timer and updates all subscribers every second - 100 ms polling.
   */
  _start() {
    this._eventLog.log("Timer started.");
    if (this._interval === null) {
      this._lastUpdateTime = this._getCurrentTime();
      this._interval = setInterval(() => {
        const currentTime = this._getCurrentTime();

        if (currentTime > this._lastUpdateTime) {
          this._lastUpdateTime = currentTime;
          this._subscribers.forEach((handler) => handler.update());
        }
      }, 100);
    }
  }

  /**
   * Unsubscribes a handler from the timer.
   * Stops the timer if there are no more subscribers.
   *
   * @param {string} botName - The name of the bot.
   * @param {string} guildId - The ID of the guild.
   */
  unsubscribe(botName, guildId) {
    const key = this._generateKey(botName, guildId);
    if (this._subscribers.has(key)) {
      this._subscribers.delete(key);

      if (this._subscribers.size === 0) {
        this._stop();
      }
    }

    return;
  }

  /**
   * Stops the timer and clears the interval.
   */
  _stop() {
    if (this._interval !== null) {
      clearInterval(this._interval);
      this._interval = null;
      this._lastUpdateTime = null;
      this._eventLog.log("Timer stopped.");
    }

    return;
  }

  /**
   * Gets the handler for a specific bot and guild.
   *
   * @param {string} botName - The name of the bot.
   * @param {string} guildId - The ID of the guild.
   * @returns {Handler|null} - The handler, or null if not found.
   */
  getHandler(botName, guildId) {
    const key = this._generateKey(botName, guildId);

    return this._subscribers.get(key) || null;
  }

  /**
   * Gets the current time with milliseconds set to 0.
   *
   * @returns {Date} - The current time.
   */
  _getCurrentTime() {
    const time = new Date();
    time.setMilliseconds(0);

    return time;
  }
}

export default new Timer(); // Export a singleton instance of Timer
