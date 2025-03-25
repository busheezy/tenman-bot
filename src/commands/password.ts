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
import { serversConfig, getServerById } from '../services/ServersConfig';
import { registerButtonHandler } from '../buttonHandler';
import { getRandomPassword } from '../utils/getRandomPassword';
import { setPassword } from '../services/ptero/setPassword';

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
    .setName('serverId')
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

    const serverId = interaction.options.get('serverId')?.value as string;

    if (!serverId) {
      await interaction.reply({
        content: 'Invalid server ID.',
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    const server = getServerById(serverId);
    const serverName = server?.name ?? serverId;

    const confirm = new ButtonBuilder().setLabel('Confirm').setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
      .setCustomId('cancel')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Secondary);

    registerButtonHandler(confirm, async (buttonInteraction) => {
      const newPass = getRandomPassword();

      await setPassword(serverId, newPass);

      const ipAndPort = server?.port
        ? `connect ${server?.ip}:${server?.port}`
        : `connect ${server?.ip}`;

      await buttonInteraction.update({
        content: `Password for \`\`${serverName}\`\` has been changed: ||\`\`${ipAndPort}; password ${newPass}\`\`||`,
        components: [],
      });
    });

    registerButtonHandler(cancel, async (buttonInteraction) => {
      await buttonInteraction.update({
        content: 'Password change has been cancelled.',
        components: [],
      });
    });

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(cancel, confirm);

    await interaction.reply({
      content: `Are you sure you want to change the password for: \`\`${serverName}\`\`?`,
      components: [row],
      flags: MessageFlags.Ephemeral,
    });
  }
}

export const passwordCommand = {
  data,
  execute,
};
