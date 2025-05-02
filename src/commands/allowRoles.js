import {
  PermissionFlagsBits,
  SlashCommandBuilder,
  ComponentType,
  RoleSelectMenuBuilder,
  ActionRowBuilder,
  InteractionContextType,
  MessageFlags,
} from "discord.js";
import { db } from "../index.js";

const data = new SlashCommandBuilder()
  .setName("allowroles")
  .setDescription(`Allows roles to use the bot`)
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
  .setContexts(InteractionContextType.Guild);

/**
 * Command used to allow selected roles to interact with the bot.
 * Any role may use the bot commands, however by default only the user that started the bot may use it.
 *
 * @param {object} interaction - The interaction object.
 * @returns - None. Replies to the interaction with the selected roles or an error message.
 */
async function execute(interaction) {
  try {
    const guild = interaction.guild;

    if (!guild) {
      return interaction.reply({
        content: "This command can only be used in a server.",
        flags: MessageFlags.Ephemeral,
      });
    }

    const roleSelectMenu = new RoleSelectMenuBuilder()
      .setCustomId("select-roles")
      .setPlaceholder("Select roles to allow")
      .setMinValues(1)
      .setMaxValues(25); // Discord's limit for select menu options

    const actionRow = new ActionRowBuilder().addComponents(roleSelectMenu);

    await interaction.reply({
      content: "Select the roles you want to allow:",
      components: [actionRow],
      flags: MessageFlags.Ephemeral,
    });

    const collector = interaction.channel.createMessageComponentCollector({
      componentType: ComponentType.RoleSelect,
      time: 60000,
    });

    collector.on("collect", async (selectInteraction) => {
      if (selectInteraction.customId === "select-roles") {
        const selectedRoles = selectInteraction.values;

        try {
          await db.updateGuildConfig(guild.id, selectedRoles);

          await selectInteraction.update({
            content: `The following roles have been allowed: ${selectedRoles.map((roleId) => `<@&${roleId}>`).join(", ")}`,
            components: [],
          });
        } catch (error) {
          console.error("Error saving roles to the database:", error);
          await selectInteraction.update({
            content:
              "*An error occurred while saving the roles.* Please try again later.",
            components: [],
          });
        }
      }
    });

    collector.on("end", async (collected, reason) => {
      if (reason === "time") {
        try {
          await interaction.editReply({
            content: "*The role selection menu has expired.*",
            components: [],
          });
        } catch (error) {
          console.error("Error editing the expired reply:", error);
        }
      }
    });
  } catch (error) {
    console.error("Error executing the allowRoles command:", error);
    try {
      await interaction.reply({
        content: "*An unexpected error occurred while executing the command.* Please try again later.",
        flags: MessageFlags.Ephemeral,
      });
    } catch (replyError) {
      console.error("Error sending error reply:", replyError);
    }
  }
}

export { data, execute };
