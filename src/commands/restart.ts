import { GuildMember, SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { pteroClient } from '../pteroClient';
import Bluebird from 'bluebird';
import { env } from '../env';

const { DISCORD_ADMINS, TENMAN_SERVER_IDS } = env;

const data = new SlashCommandBuilder().setName('restart').setDescription('Restart the servers.');

async function execute(interaction: CommandInteraction) {
  if (interaction.member instanceof GuildMember) {
    if (!DISCORD_ADMINS.includes(interaction.member.user.id)) {
      await interaction.reply({
        content: 'You do not have permission to use this command.',
        ephemeral: true,
      });

      return;
    }

    await Bluebird.mapSeries(TENMAN_SERVER_IDS, async (serverIdentifier) => {
      await pteroClient.post(`/servers/${serverIdentifier}/power`, {
        signal: 'restart',
      });
    });

    await interaction.reply({
      content: `The servers have been restarted.`,
      ephemeral: true,
    });
  }
}

export const restartCommand = {
  data,
  execute,
};
