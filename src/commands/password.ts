import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  GuildMember,
  MessageFlags,
  SlashCommandBuilder,
} from 'discord.js';
import { isCaptain } from '../utils/isCaptain';
import { serversConfig } from '../services/ServersConfig';
import { registerButtonHandler } from '../buttonHandler';

const serverChoices = serversConfig.map((server) => {
  return {
    name: server.name,
    value: server.serverId,
  };
});

const data = new SlashCommandBuilder()
  .setName('password')
  .setDescription('Change the server password.');

data.addStringOption((option) => {
  return option
    .setName('server')
    .setDescription('Select the server')
    .setRequired(true)
    .addChoices(...serverChoices);
});

async function execute(interaction: CommandInteraction) {
  if (interaction.member instanceof GuildMember) {
    if (!isCaptain(interaction.member)) {
      await interaction.reply({
        content: 'You do not have permission to use this command.',
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    const serverId = interaction.options.get('server')?.value;

    const confirm = new ButtonBuilder()
      .setLabel('Confirm Password Change')
      .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
      .setCustomId('cancel')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary);

    registerButtonHandler(confirm, async (buttonInteraction) => {
      await buttonInteraction.reply({
        content: `Password for server ${serverId} has been changed.`,
        flags: MessageFlags.Ephemeral,
      });
    });

    registerButtonHandler(cancel, async (buttonInteraction) => {
      await buttonInteraction.reply({
        content: 'Password change has been cancelled.',
        flags: MessageFlags.Ephemeral,
      });
    });

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(cancel, confirm);

    await interaction.reply({
      content: `Are you sure you want to change the password for server ${serverId}?`,
      components: [row],
      flags: MessageFlags.Ephemeral,
    });
  }
}

export const passwordCommand = {
  data,
  execute,
};
