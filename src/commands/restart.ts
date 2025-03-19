import { GuildMember, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { CommandInteraction } from 'discord.js';
import { pteroClient } from '../pteroClient';
import Bluebird from 'bluebird';
import { env } from '../env';
import { isCaptain } from '../utils/isCaptain';

const { TENMAN_SERVER_IDS } = env;

const data = new SlashCommandBuilder().setName('restart').setDescription('Restart the servers.');

async function execute(interaction: CommandInteraction) {
  if (interaction.member instanceof GuildMember) {
    if (!isCaptain(interaction.member)) {
      await interaction.reply({
        content: 'You do not have permission to use this command.',
        flags: MessageFlags.Ephemeral,
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
      flags: MessageFlags.Ephemeral,
    });
  }
}

export const restartCommand = {
  data,
  execute,
};
