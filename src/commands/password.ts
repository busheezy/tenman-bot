import { GuildMember, SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { pteroClient } from '../pteroClient';
import Bluebird from 'bluebird';
import generator from 'generate-password';
import { env } from '../env';

const { DISCORD_ADMINS, TENMAN_SERVER_IDS } = env;

const data = new SlashCommandBuilder()
  .setName('password')
  .setDescription('Change the server password.');

async function execute(interaction: CommandInteraction) {
  const password = generator.generate({
    length: 10,
    numbers: true,
  });

  if (interaction.member instanceof GuildMember) {
    if (!DISCORD_ADMINS.includes(interaction.member.user.id)) {
      await interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true,
      });

      return;
    }

    await Bluebird.mapSeries(TENMAN_SERVER_IDS, async (serverIdentifier) => {
      await pteroClient.put(`/servers/${serverIdentifier}/startup/variable`, {
        key: 'PASSWORD',
        value: password,
      });

      await pteroClient.post(`/servers/${serverIdentifier}/command`, {
        command: `sv_password "${password}"`,
      });
    });

    await interaction.reply({
      content: `The password has been changed to ||\`\`${password}\`\`|| for all servers.`,
      ephemeral: true,
    });
  }
}

export const passwordCommand = {
  data,
  execute,
};
