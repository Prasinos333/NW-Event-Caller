import Handler from "./handler.js";
import { db } from "../index.js";
import timer from "../util/timer.js";
import { EmbedBuilder } from "discord.js";
import {
  REPO_URL,
  BOT_ICON,
  DEFAULT_LANG,
  respawns,
  BAR_CONFIG,
} from "../config.js";

class WarHandler extends Handler {
  constructor(botData, userId, voiceChannelName) {
    super(botData, userId, voiceChannelName);
    this._lastRespawn = null;
    this._wave = 1;
  }

  /**
   * Starts the war timer and plays the initial audio.
   *
   * @returns {void} - No return value.
   */
  async start() {
    if (!db.isConnected()) {
      db.reconnect();
    }

    this.setupButtonCollector(this._messageData.message, "war");
    await this._getConfig();
    this._logger.log(
      `Start time: ${this._startTime.toLocaleString("en-US", { timeZone: "America/New_York", timeStyle: "short" })}`
    );
    this._playAudio("War_notice.mp3", "war");
    timer.subscribe(this._botName, this._guildId, this);

    return;
  }

  /**
   * Updates the war handler timer and plays the corresponding audio if necessary.
   *
   * @returns {void} - No return value.
   */
  update() {
    try {
      const chrono = 1800 - (this._getCurrentTime() - this._startTime) / 1000;
      const currentRespawn = this._getNextRespawn(chrono);

      this._checkMessage();
      this._updateEmbed(this.createEmbed(chrono, currentRespawn));

      if (chrono === 1801) {
        this._logger.log("War starting (chrono: %s).", chrono);
        this._playAudio("War_start.mp3", "war");
      } else if (chrono <= 0) {
        this._logger.log("Stopping timer (chrono: %s).", chrono);
        this._stop();
        return;
      }

      if (chrono <= 1800 && currentRespawn) {
        switch (chrono - currentRespawn.value) {
          case 6:
            this._logger.log(
              "Playing 5 second countdown (chrono: %s).",
              chrono
            );
            this._playAudio("5_second_countdown.mp3", "war");
            break;

          case 11:
            this._logger.log("Playing 10 seconds (chrono: %s).", chrono);
            this._playAudio("10_seconds.mp3", "war");
            break;

          case 21:
            this._logger.log("Playing 20 seconds (chrono: %s).", chrono);
            this._playAudio("20_seconds.mp3", "war");
            break;

          case 31:
            this._logger.log("Playing 30 seconds (chrono: %s).", chrono);
            this._playAudio("30_seconds.mp3", "war");
            break;

          case 41:
            this._logger.log("Playing 40 seconds (chrono: %s).", chrono);
            this._playAudio("40_seconds.mp3", "war");
            break;

          case 51:
            this._logger.log("Playing 50 seconds (chrono: %s).", chrono);
            this._playAudio("50_seconds.mp3", "war");
            break;
        }
      }
    } catch (error) {
      this._logger.error(`Error calling respawns:`, error);
    }

    return;
  }

  /**
   * Create an embed for the war handler.
   * Title: Respawn in: ${seconds}
   *
   * Description: Progress Bar
   * Fields:
   * ---Next Respawn--- ---Current Interval--- ---Next Interval---
   * ---Time Remaining--- ---Wave--- ---Lang---
   * ---Start Time <t:epoch>--- ---Voice Channel---
   *
   * @param {number} chrono - Seconds remainig in the event.
   * @param {object} currentRespawn - The current respawn object.
   * @returns {object} - The embed object.
   */
  createEmbed(chrono = 1800, currentRespawn = this._getNextRespawn(1800)) {
    const seconds = chrono - currentRespawn?.value;
    let title, description;

    if(seconds < 0) {
      title = "None Respawns Remaining";
      description = "N/A";
    } else {
      title = seconds === 0 ? "RESPAWNS NOW" : `Respawn in: ${seconds}`;
      description = this._getProgressbar(this._getInterval(chrono).currentInterval, seconds);
    }
    
    const respawnTime = this._formatSeconds(currentRespawn.value);
    const totalRemaining = this._formatSeconds(chrono);
    const { currentInterval, nextInterval } = this._getInterval(chrono);

    const warEmbed = new EmbedBuilder()
      .setColor(this._botColor)
      .setAuthor({
        name: "NW Event Caller",
        iconURL: BOT_ICON,
        url: REPO_URL,
      })
      .setTitle(title)  
      .setDescription(description)
      .addFields(
        { name: "Next Respawn", value: `\`${respawnTime}\`` },
        {
          name: "Current Interval",
          value: `**${currentInterval}** *Secs*`,
          inline: true,
        },
        {
          name: "Next Interval",
          value: `**${nextInterval}** *Secs*`,
          inline: true,
        },
        { name: "Time Remaing", value: `\`${totalRemaining}\``, inline: true },
        { name: "Wave", value: `\`${this._wave}\``, inline: true },
        { name: "Lang", value: `\`${this._lang}\``, inline: true },
        {
          name: "Voice Channel",
          value: `<#${this._voiceChannel.id}>`,
          inline: true,
        }
      )
      .setFooter({ text: "War Timer" })
      .setTimestamp(this._startTime);

    return warEmbed;
  }

  /**
   * Retrieves the configuration for the user from the database.
   * Since the war and invasion config tables are shared, the lang is set to the default if the current lang doesn't have the necessary audio files.
   */
  async _getConfig() {
    try {
      const config = await db.getConfig(this._userId);

      if (config) {
        if (config.lang !== "en_4") {
          this._lang = config.lang;
        } else {
          this._lang = DEFAULT_LANG;
        }
      }
    } catch (error) {
      this._logger.error("Error retrieving configuration:", error);
    }

    return;
  }

  /**
   * Retrieves the first element in the respawn array for a given wave that is less than value.
   *
   * @param {number} chrono - The current time in seconds.
   * @returns {object} - The next respawn object.
   */
  _getNextRespawn(chrono) {
    const nextRespawn = respawns.find(
      (respawn) =>
        chrono > respawn.value &&
        (respawn.wave == 0 || respawn.wave == this._wave)
    );

    return nextRespawn;
  }

  /**
   * Changes the current setting(s) for the war handler.
   *
   * @param {Array} setting - Thew new setting(s) to change.
   */
  _changeSetting(setting) {
    this._setting = setting;
    this._modifiedConfig = true;

    return;
  }

  /**
   * Changes the current wave.
   *
   * @returns {number} - The new value for wave.
   */
  _changeWave() {
    switch (this._wave) {
      case 1:
        this._wave = 2;
        break;
      case 2:
        this._wave = 1;
        break;
    }

    return this._wave;
  }

  /**
   * Retrieves both the current and next interval durations in seconds given seconds remaining in the event.
   * The respawn array is filtered based on the current wave and current respawn is determined.
   * The previous and next respawns are based off the position of the current respawn in the array.
   * Then the current and next intervals are calculated based on the respawn values.
   *
   * @param {number} chrono - Seconds remaining in the event.
   * @returns {object} - The data containing both the current and next interval durations in seconds.
   */
  _getInterval(chrono) {
    const relevantRespawns = respawns.filter(
      (respawn) => respawn.wave === 0 || respawn.wave === this._wave
    );
    const currentIndex = relevantRespawns.findIndex(
      (respawn) => chrono > respawn.value
    );

    if (currentIndex === -1) {
      return { currentInterval: "N/A", nextInterval: "N/A" }; // No valid respawn found
    }

    const currentRespawn = relevantRespawns[currentIndex];
    const previousRespawn =
      currentIndex > 0 ? relevantRespawns[currentIndex - 1] : null;
    const nextRespawn =
      currentIndex < relevantRespawns.length - 1
        ? relevantRespawns[currentIndex + 1]
        : null;

    const currentInterval = previousRespawn
      ? previousRespawn.value - currentRespawn.value
      : "N/A";

    const nextInterval = nextRespawn
      ? currentRespawn.value - nextRespawn.value
      : "N/A";

    return { currentInterval, nextInterval };
  }

  /**
   * Builds a progress bar string based on the current interval and seconds remaining.
   *
   * @param {number} currentInterval - Duration of interval in seconds.
   * @param {number} seconds - Seconds remaining in the current interval.
   * @returns {string} - The progress bar string.
   */
  _getProgressbar(currentInterval, seconds) {
    if (currentInterval === "N/A" || seconds === "N/A") {
      return "Prep Phase";
    }

    const { barWidth, barIconFull, barIconEmpty } = BAR_CONFIG;
    const percentageCompleted = (currentInterval - seconds) / currentInterval;
    const fullIcons = Math.round(percentageCompleted * barWidth);
    const emptyIcons = barWidth - fullIcons;
    const progressBar = `[${barIconFull.repeat(fullIcons)}${barIconEmpty.repeat(emptyIcons)}]`;

    return progressBar;
  }
}

export default WarHandler;
