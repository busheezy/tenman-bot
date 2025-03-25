import {
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
import { setPassword } from '../services/ptero/setPassword';
import { formatIpAndPort } from '../utils/formatIpAndPort';
import { getRandomPassword } from '../utils/getRandomPassword';

const serverChoices = serversConfig.map((server) => {
  return {
    name: server.name,
    value: server.serverId,
  };
});

const serverOptionKey = 'name';

const data = new SlashCommandBuilder()
  .setName('password')
  .setDescription('Change the server password.');

data.addStringOption((option) => {
  return option
    .setName(serverOptionKey)
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

    const serverId = interaction.options.get(serverOptionKey)?.value as string;

    if (!serverId) {
      await interaction.reply({
        content: 'Invalid server ID.',
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    const server = getServerById(serverId);

    if (!server) {
      await interaction.reply({
        content: 'An error occurred while fetching the server.',
        flags: MessageFlags.Ephemeral,
      });

      return;
    }

    const serverName = server.name ?? serverId;

    const row = registerButtonHandler({
      buttonDefintions: [
        {
          handler: async (buttonInteraction) => {
            const newPass = getRandomPassword();

            await setPassword(serverId, newPass);

            const ipAndPort = formatIpAndPort(server.ip, server.port);

            await buttonInteraction.update({
              content: `Password for \`\`${serverName}\`\` has been changed: ||\`\`\`${ipAndPort}; password ${newPass}\`\`\`||`,
              components: [],
            });
          },
          button: new ButtonBuilder().setLabel('Confirm').setStyle(ButtonStyle.Danger),
        },
        {
          handler: async (buttonInteraction) => {
            await buttonInteraction.update({
              content: 'Password change has been cancelled.',
              components: [],
            });
          },
          button: new ButtonBuilder()
            .setCustomId('cancel')
            .setLabel('Cancel')
            .setStyle(ButtonStyle.Secondary),
        },
      ],
      runOnce: true,
    });

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
