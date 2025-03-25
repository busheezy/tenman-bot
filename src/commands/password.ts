import Bluebird from 'bluebird';
import { CommandInteraction, GuildMember, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { env } from '../env';
import { getPteroServer } from '../services/ptero/getServer';
import { isCaptain } from '../utils/isCaptain';
import { serversConfig } from '../services/ServersConfig';

const { TENMAN_SERVER_IDS } = env;

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

    await Bluebird.mapSeries(TENMAN_SERVER_IDS, async (serverId) => {
      const serverResponse = await getPteroServer(serverId);

      console.log(serverResponse.attributes.name);
    });

    await interaction.reply('woo');
  }
}

export const passwordCommand = {
  data,
  execute,
};
