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

    this.setupButtonCollector(this._messageData.message, "invasion");
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
  update() { // TODO - Update embed even for timings not in settings.
    try {
      const chrono = 1500 - (this._getCurrentTime() - this._startTime) / 1000;
      let nextTiming = this._getNextTiming(chrono);

      if (chrono === 1501) {
        this._logger.log("Invasion Starting (chrono: %s)", chrono);
        this._playAudio("Invasion_start.mp3", "invasion");
      } else if (chrono <= 0) {
        this._logger.log("Stopping timer (chrono: %s)", chrono);
        this.stop();
        return;
      }

      if (nextTiming && chrono - nextTiming.value === 1) {
        this._checkMessage();
        this._updateEmbed(this.createEmbed(chrono - 1));

        if (
          this._setting.some((setting) =>
            nextTiming.name.toLowerCase().includes(setting)
          )
        ) {
          this._logger.log(`Playing: "${nextTiming.name}" (chrono: %s)`, chrono);
          this._playAudio(nextTiming.name, "invasion");
        }
      } else {
        if(this._updateRequired) {
          this._updateEmbed(this.createEmbed(chrono));
          this._updateRequired = false;
        }
      }
    } catch (error) {
      this._logger.error(`Error calling invasion:`, error);
    }

    return;
  }

  /**
   * Fields:
   * ---Close Spawn--- ---Siege--- ---Phase---
   * ---Lang--- ---Settings--- ---Voice Channel--- 
   *
   * @param {number} chrono - Seconds remainig in the event.
   * @returns {object} - The embed object.
   */
  createEmbed(chrono = 1500) {
    const { name: closeName, time: closeTime } = this._getTimingByName(chrono, "Close");
    const { name: siegeName, time: siegeTime } = this._getTimingByName(chrono, "Siege");
    const { name: phaseName, time: phaseTime } = this._getTimingByName(chrono, "Phase");

    this._logger.info(`Creating embed for: ${this._formatSeconds(chrono)} 
    \n| ${closeName} : ${closeTime} |
    \n| ${siegeName} : ${siegeTime} |
    \n| ${phaseName} : ${phaseTime} |`);

    const invasionEmbed = new EmbedBuilder()
      .setColor(this._botColor)
      .setAuthor({
        name: "NW Event Caller",
        iconURL: BOT_ICON,
        url: REPO_URL,
      })
      .addFields(
        { name: closeName, value: `   \`${closeTime}\``, inline: true },
        { name: siegeName, value: `   \`${siegeTime}\``, inline: true },
        { name: phaseName, value: `   \`${phaseTime}\``, inline: true },
        { name: "Lang", value: `   \`${this._lang}\``, inline: true },
        {
          name: "Settings",
          value: `\`${this._setting.join("` \n `")}\``,
          inline: true,
        },
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
      this._updateRequired = true;
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
   * @returns {object} - The object containing the name and time of the next timing.
   */
  _getTimingByName(chrono, name) {
    const nextTiming = invasionTimings.find(
      (timing) =>
        timing.name.includes(name) &&
        !timing.name.includes("warn") &&
        chrono > Math.round(nextTiming.value / 10) * 10
    );

    const timingData = {}; // Initialize the timingData object
    if (nextTiming) {
      timingData.name = nextTiming.name.replace(".mp3", "").replace(/_/g, " "); // Remove ".mp3" and replace "_" with spaces
      timingData.time = this._formatSeconds(Math.round(nextTiming.value / 10) * 10); // Format the time, rounding to remove audio offset
    } else {
      timingData.name = "None";
      timingData.time = "N/A";
    }

  return timingData;
  }

  _changeSetting(setting) {
    this._setting = setting;
    this._modifiedConfig = true;
    this._updateRequired = true;
  }
}

export default InvasionHandler;
