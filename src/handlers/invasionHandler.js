import Handler from "./handler.js";
import { db } from "../index.js";
import timer from "../util/timer.js";
import { EmbedBuilder } from "discord.js";
import { BOT_ICON, invasionTimings, REPO_URL } from "../config.js";

class InvasionHandler extends Handler {
  constructor(botData, userId, voiceChannel) {
    super(botData, userId, voiceChannel);
    this._setting = ["phase", "skull", "close"];
  }

  /**
   * Starts the invasion timer and plays the initial audio.
   *
   * @returns {void} - No return value.
   */
  async start() {
    if (!db.isConnected()) {
      db.reconnect();
    }

    this.setupCollector(this._messageData.message);
    await this._getConfig();
    this._logger.log(
      `Start time: ${this._startTime.toLocaleString("en-US", { timeZone: "America/New_York", timeStyle: "short" })}`
    );
    this._playAudio("Invasion_notice.mp3", "invasion");
    timer.subscribe(this._botName, this._guildId, this);

    return;
  }

  /**
   * Updates the invasion timer and plays the corresponding audio if necessary.
   *
   * @returns {void} - No return value.
   */
  update() {
    try {
      const chrono = 1500 - (this._getCurrentTime() - this._startTime) / 1000;
      let nextTiming = this._getNextTiming(chrono);

      if (chrono === 1501) {
        this._logger.log("Invasion Starting (chrono: %s).", chrono);
        this._playAudio("Invasion_start.mp3", "invasion");
      } else if (chrono <= 0) {
        this._logger.log("Stopping timer (chrono: %s).", chrono);
        this.stopAudio();
        return;
      }

      if (nextTiming && chrono - nextTiming.value === 1) {
        this._updateEmbed(this.createEmbed(chrono));

        if (
          this._setting.some((setting) =>
            nextTiming.name.toLowerCase().includes(setting)
          )
        ) {
          this._logger.log(`Playing "${nextTiming.name}"`);
          this._playAudio(nextTiming.name, "invasion");
        }
      }
    } catch (error) {
      this._logger.error(`Error calling invasion:`, error);
    }

    return;
  }

  /**
   * Fields:
   * ---Voice Channel--- ---Start Time <t:epoch>--- ---Lang---
   * ---Close Spawn--- ---Siege--- ---Phase---
   *
   * @param {number} chrono - Seconds remainig in the event.
   * @returns {object} - The embed object.
   */
  createEmbed(chrono = 1500) {
    const closeTime = this._getTimingByName(chrono, "Close");
    const siegeTime = this._getTimingByName(chrono, "Siege");
    const phaseTime = this._getTimingByName(chrono, "Phase");

    const invasionEmbed = new EmbedBuilder()
      .setColor(this._botColor)
      .setAuthor({
        name: "NW Event Caller",
        iconURL: BOT_ICON,
        url: REPO_URL,
      })
      .addFields(
        { name: "   Close   ", value: `   \`${closeTime}\``, inline: true },
        { name: "   Siege   ", value: `   \`${siegeTime}\``, inline: true },
        { name: "   Phase   ", value: `   \`${phaseTime}\``, inline: true },
        { name: "   Lang    ", value: `   \`${this._lang}\``, inline: true },
        {
          name: "Voice Chanel",
          value: `<#${this._voiceChannel.id}>`,
          inline: true,
        }
      )
      .setFooter({ text: "Invasion Timer" })
      .setTimestamp(this._startTime);

    return invasionEmbed;
  }

  /**
   * Retrieves the configuration for the user from the database.
   */
  async _getConfig() {
    const config = await db.getUserConfig(this._userId);

    if (config) {
      this._lang = config.Lang;
      this._setting = config.Setting;
    }

    return;
  }

  /**
   *  Retrieves the first element in the invasion array that is less than chrono.
   *
   * @param {number} chrono - Seconds remaining in the event.
   * @returns {object} - The next timing object.
   */
  _getNextTiming(chrono) {
    const nextInvasionTiming = invasionTimings.find(
      (timing) => chrono > timing.value
    );
    return nextInvasionTiming;
  }

  /**
   * Retrieves the first element in the invasion array that is less than chrono and
   * whose name contains the specified name as a substring.
   *
   * @param {number} chrono - Seconds remaining in the event.
   * @param {string} name - The name of the timing to retrieve.
   * @returns {string} - The time string formatted as "m:ss".
   */
  _getTimingByName(chrono, name) {
    const nextTiming = invasionTimings.find(
      (timing) =>
        timing.name.includes(name) &&
        Math.round(timing.value / 10) * 10 < chrono
    );

    if (nextTiming) {
      return this._formatSeconds(Math.round(nextTiming.value / 10) * 10);
    } else {
      return null;
    }
  }
}

export default InvasionHandler;
