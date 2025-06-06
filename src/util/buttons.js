import {
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
} from "discord.js";
import { invasionOptions, invasionVoices, warVoices } from "../config.js";

export const stopButton = new ButtonBuilder()
  .setCustomId("stop")
  .setStyle(ButtonStyle.Danger)
  .setEmoji("⏹️")
  .setLabel("End");

export const langButton = new ButtonBuilder()
  .setCustomId("lang")
  .setStyle(ButtonStyle.Secondary)
  .setEmoji("🌐")
  .setLabel("Lang");

export const settingsButton = new ButtonBuilder()
  .setCustomId("settings")
  .setStyle(ButtonStyle.Primary)
  .setEmoji("⚙️")
  .setLabel("Settings");

export const invasionSelect = new StringSelectMenuBuilder()
  .setCustomId("select")
  .setPlaceholder("Select a voice")
  .addOptions(invasionVoices);

export const invasionSettings = new StringSelectMenuBuilder()
  .setCustomId("options")
  .setPlaceholder("Timings to be called")
  .addOptions(invasionOptions)
  .setMinValues(1)
  .setMaxValues(4);

export const warSelect = new StringSelectMenuBuilder()
  .setCustomId("select")
  .setPlaceholder("Select a voice")
  .addOptions(warVoices);

export const waveButton = new ButtonBuilder()
  .setCustomId("wave_switch")
  .setStyle(ButtonStyle.Secondary)
  .setEmoji("🔄")
  .setLabel("Switch Wave");

export const blankField = { name: "\u200B", value: "\u200B", inline: true }; // Empty field for embed
