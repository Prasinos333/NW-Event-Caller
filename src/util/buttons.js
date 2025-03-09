import { ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } from 'discord.js';
import { invasionOptions, invasionVoices, warVoices } from '../config';

export const stopButton = new ButtonBuilder()
                .setCustomId('stop')
                .setStyle(ButtonStyle.Danger)
                .setEmoji('⏹️');

export const muteButton = new ButtonBuilder()
                .setCustomId('mute')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🔇');

export const unmuteButton = new ButtonBuilder()
                .setCustomId('unmute')
                .setStyle(ButtonStyle.Success)
                .setEmoji('🔊');

export const settingsButton = new ButtonBuilder()
                .setCustomId('settings')
                .setStyle(ButtonStyle.Primary)
                .setEmoji('⚙️');

export const invasionSelect = new StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Change Voice')
                .addOptions(invasionVoices);

export const warSelect = new StringSelectMenuBuilder()
                .setCustomId('select')
                .setPlaceholder('Change Voice')
                .addOptions(warVoices);

export const invasionSettings = new StringSelectMenuBuilder()
                .setCustomId('setting')
                .setPlaceholder('Timings to be called')
                .addOptions(invasionOptions)
                .setMinValues(1)
                .setMaxValues(4);


    