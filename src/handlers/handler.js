import logger from "../util/logger.js";
import path from "path";
import {
  createAudioPlayer,
  NoSubscriberBehavior,
  AudioPlayerStatus,
  createAudioResource,
  getVoiceConnection,
} from "@discordjs/voice";
import { MessageFlags, ComponentType, ActionRowBuilder } from "discord.js";
import { DEFAULT_LANG } from "../config.js";
import {
  invasionSettings,
  invasionSelect,
  warSelect,
} from "../util/buttons.js";
import timer from "../util/timer.js";
import { db } from "../index.js";
import fs from "fs";

class Handler {
  constructor(botData, userId, voiceChannel) {
    this._botName = botData.name;
    this._botColor = botData.color;
    this._uId = botData.uId;
    this._logger = logger(this._botName);
    this._guildId = voiceChannel.guildId;
    this._userId = userId;
    this._lang = DEFAULT_LANG;
    this._messageData = null;
    this._modifiedConfig = false;
    this._voiceChannel = voiceChannel;
    this._startTime = this._getStartTime();
    this._updateRequired = false;

    this._player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });
  }

  /**
   * Sets the message data for the handler.
   *
   * @param {any} messageData - The data of the message to set.
   */
  set messageData(messageData) {
    this._messageData = messageData;
  }

  /**
   * Subscribes the bot to the audio player.
   *
   * @param {VoiceConnection} connection - The voice connection to subscribe to the audio player.
   */
  subscribeConnection(connection) {
    connection.subscribe(this._player);
  }

  /**
   * Base method to create embed for the handler.
   * Throws an error if not implemented in the subclass.
   */
  createEmbed() {
    throw new Error(
      "The 'createEmbed()' method must be implemented in the subclass."
    );
  }

  /**
   * Starts the handler.
   * Throws an error if not implemented in the subclass.
   * - Play initial audio.
   * - Subscribe timer to handler.
   */
  start() {
    throw new Error(
      "The 'start()' method must be implemented in the subclass."
    );
  }

  /**
   * Base update method to be overridden by subclasses.
   * Throws an error if not implemented in the subclass.
   */
  update() {
    throw new Error(
      "The 'update()' method must be implemented in the subclass."
    );
  }

  /**
   * Stops the handler.
   * - Log if interaction user id is different from this._userID.
   * - Destroy connection if it exists.
   * - Delete message if it exists.
   * - Save config if modified.
   * - Unsubscribe timer from handler.
   */
  async stop(user = null) {
    if (user && user.id !== this._userId) {
      this._logger.warn({
        msg: "Stop command launched by different user.",
        guildId: this._guildId,
        user: user.username,
      });
    }

    this._destroyConnection();
    await this._deleteMessage();

    if (this._modifiedConfig) {
      this._saveConfig();
    }

    timer.unsubscribe(this._botName, this._guildId);

    return;
  }

  /**
   * Sets up a message component collector for the provided message.
   * Handles button and string select interactions.
   *
   * @param {object} message - The message object to setup the collector for.
   */
  async setupButtonCollector(message, type) {
    try {
      const collector = message.createMessageComponentCollector();

      collector.on("collect", async (interaction) => {
        try {
          await interaction.deferReply({ flags: MessageFlags.Ephemeral });

          const allowedRoles = await db.getGuildConfig(this._guildId);
          const userRoles = interaction.member.roles.cache.map((role) => role.id);
          const isAuthorized =
            interaction.user.id === this._userId ||
            (allowedRoles && userRoles.some((role) => allowedRoles.includes(role)));

          if (!isAuthorized) {
            await interaction.editReply({
              content: "You are not authorized to interact with this button.",
              flags: MessageFlags.Ephemeral,
            });
            return;
          }

          switch (interaction.customId) {
            case "lang": {
              const langMenu = type === "invasion" ? invasionSelect : warSelect;

              if (this._activeLangCollector) {
                this._activeLangCollector.stop();
              }

              this._activeLangCollector = await this._handleMenuInteraction(
                interaction,
                langMenu,
                (selectedLang) => {
                  this._changeLang(selectedLang[0]); // Update the language
                  this._modifiedConfig = true;
                },
                "Language"
              );

              break;
            }

            case "settings": {
              if (this._setting) {
                if (this._activeSettingsCollector) {
                  this._activeSettingsCollector.stop();
                }

                this._activeSettingsCollector = await this._handleMenuInteraction(
                  interaction,
                  invasionSettings,
                  (selectedSettings) => {
                    this._changeSetting(selectedSettings); // Update the settings
                    this._modifiedConfig = true;
                  },
                  "Settings"
                );
              }

              break;
            }

            case "stop":
              this.stop(interaction.user);
              await interaction
                .deleteReply()
                .catch((error) => this._logger.error(error, "Error deleting reply."));
              break;

            case "wave_switch":
              if (this._wave) {
                this._changeWave();
              }

              await interaction.editReply({
                content: `Changed to wave \`${this._wave}\``,
                flags: MessageFlags.Ephemeral,
              });

              break;
          }
        } catch (error) {
          if (error.code === 10062) {
            // DiscordAPIError: Unknown Interaction
            this._logger.error("Interaction no longer valid. Skipping.");
          } else {
            this._logger.error({
              msg: "Error handling interaction.",
              err: error
            });
          }
        }
      });

      collector.on("end", (collected, reason) => {
        if (reason === "time") {
          this._logger.info("Button collector timed out.");
        } else {
          this._logger.info({
            msg: "Button collector ended.",
            reason: reason
          });
        }
      });
    } catch (error) {
      this._logger.error({
        msg: "Error setting up button collector.",
        err: error
      });
    }
  }

  /**
   * Handles menu interactions for a given menu and callback.
   *
   * @param {object} interaction - The interaction object.
   * @param {object} menu - The menu to display (e.g., langMenu or settingsMenu).
   * @param {function} callback - The callback function to handle the selected values.
   * @param {string} menuType - The log message to display after processing.
   */
  async _handleMenuInteraction(interaction, menu, callback, menuType) {
    try {
      // Send the ephemeral reply with the menu
      await interaction.editReply({
        components: [new ActionRowBuilder().addComponents(menu)],
        flags: MessageFlags.Ephemeral,
      });

      // Create a collector for the menu
      const filter = (i) => i.user.id === interaction.user.id; // Only collect interactions from the same user
      const collector = interaction.channel.createMessageComponentCollector({
        filter,
        componentType: ComponentType.StringSelect,
        time: 60000, // Collector will stop after 60 seconds
      });

      collector.on("collect", async (menuInteraction) => {
        try {
          const selectedValues = menuInteraction.values; // Get the selected values
          callback(selectedValues); // Call the provided callback function

          await menuInteraction.update({
            content: `${menuType} updated to: \`${selectedValues.join(", ")}\``,
            components: [], // Remove the menu after selection
          });
        } catch (error) {
          if (error.code === 10062) {
            // DiscordAPIError: Unknown Interaction
            this._logger.warn("Interaction no longer valid. Skipping update.");
          } else {
            this._logger.error({
              msg: "Error processing menu interaction.",
              err: error
            });
          }
        }

        collector.stop();
      });

      collector.on("end", (collected, reason) => {
        if (reason === "time") {
          this._logger.warn({
            msg: "Menu timed out.",
            menuType: menuType,
          });
        }
      });
    } catch (error) {
      if (error.code === 10062) {
        // DiscordAPIError: Unknown Interaction
        this._logger.error("Interaction no longer valid. Skipping reply.");
      } else {
        this._logger.error({
          msg: "Error handling menu interaction.",
          err: error
        });
      }
    }
  }

  /**
   * Retrieves the start time for the timer.
   * Events start at the start of the hour or at 30 minutes past the hour.
   * If the current time is 10 minutes prior to the start of an event, the start time is set to the next event.
   * Otherwise the start time is set to the ongoing event time.
   *
   * 0-20 Minutes = 0:00
   * 20-50 Minutes = 0:30
   * 50-59 Minutes = 1:00
   *
   * @returns {Date} - The start time for the timer.
   */
  _getStartTime() {
    const time = new Date();
    time.setSeconds(0);
    time.setMilliseconds(0);
    const windowMinutes = time.getMinutes();

    if (windowMinutes < 20) {
      // 0-19 Minutes
      time.setMinutes(0);
    } else if (20 <= windowMinutes && windowMinutes < 50) {
      // 20-49
      time.setMinutes(30);
    } else if (50 <= windowMinutes) {
      // 50-59
      time.setMinutes(0);
      time.setTime(time.getTime() + 1 * 60 * 60 * 1000);
    }

    return time;
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

  /**
   * Converts total seconds into a string in "m:ss" format.
   *
   * @param {number} seconds - Total seconds.
   * @returns {string} - Formatted time string in "m:ss" format.
   */
  _formatSeconds(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes)}:${String(remainingSeconds).padStart(2, "0")}`;
  }

  /**
   * Plays the specified audio file.
   *
   * @param {string} audioName - The name of the audio file to play.
   */
  _playAudio(audioName, type) {
    try {
      const filePath = path.resolve(
        "src",
        "resources",
        this._lang,
        type,
        audioName
      );
      if (fs.existsSync(filePath)) {
        const status = this._player?.state?.status || AudioPlayerStatus.Idle;
        if (status === AudioPlayerStatus.Idle) {
          this._player.play(createAudioResource(fs.createReadStream(filePath)));
        }
      } else {
        this._logger.warn({
          msg: `Audio file does not exist`,
          filePath: filePath
        });
      }
    } catch (error) {
      this._logger.error({
        msg: "Error playing audio file",
        audioName: audioName,
        error: error
      });
    }
  }

  /**
   * Updates the embed for the handler.
   *
   * @param {object} embed - The embed object to update.
   */
  _updateEmbed(embed) {
    if (this._messageData && this._messageData.message) {
      this._messageData.message.edit({ embeds: [embed] }).catch((error) => {
        this._logger.error({
          msg: "Error updating embed.",
          err: error
        });
      });
    }

    return;
  }

  /**
   * Changes the language for the audio files.
   *
   * @param {string} lang
   */
  _changeLang(lang) {
    this._lang = lang;
    this._modifiedConfig = true;
    this._updateRequired = true;
  }

  /**
   * Destroy the voice connection for a given guild.
   *
   * @param {snowflake} guildId - The ID of the guild to get the timer for.
   */
  _destroyConnection() {
    const connection = getVoiceConnection(this._guildId, this._uId);

    if (connection) {
      connection.destroy();
    }

    return;
  }

  /**
   *
   */
  _checkMessage() {
    if (this._messageData && this._messageData.message) {
      this._messageData.message.fetch().catch((error) => {
        if (error.code === 10008) {
          this._logger.warn("Message no longer exists. Stopping...");
          this._messageData = null;
          this.stop();
        } else {
          this._logger.error({
            msg: "Error fectching message.",
            err: error
          });
        }
      });
    }

    return;
  }

  /**
   * Deletes a message based on the provided message data.
   */
  async _deleteMessage() {
    if (this._messageData && this._messageData.message) {
      const message = this._messageData.message;
      await message
        .fetch() // Check if the message still exists
        .then((message) => {
          message
            .delete()
            .then(() => this._logger.info("Message deleted successfully."))
            .catch((error) =>
              this._logger.error({
                msg: "Error deleting message.",
                err: error
              })
            );
        })
        .catch((error) => {
          if (error.code === 10008) {
            // DiscordAPIError: Unknown Message (message was deleted)
            this._logger.error("Message no longer exists. Skipping deletion.");
            this._messageData = null; // Clear the message data
          } else {
            this._logger.error({
              msg: "Error fectching message.",
              err: error
            });
          }
        });
    }

    return;
  }

  /**
   * Saves the current configuration to the database if it has been modified.
   */
  _saveConfig() {
    const setting = this._setting ?? ["phase", "skull", "close"];

    if (this._modifiedConfig) {
      db.updateUserConfig(this._userId, this._lang, setting);
    }
  }
}

export default Handler;
