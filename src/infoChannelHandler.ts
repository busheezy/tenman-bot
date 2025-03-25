import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Client,
  MessageFlags,
  TextChannel,
} from 'discord.js';
import { env } from './env';
import Bluebird from 'bluebird';

import { serversConfig } from './services/ServersConfig';
import { getPassword } from './services/ptero/getPassword';
import { registerButtonHandler } from './buttonHandler';
import { formatIpAndPort } from './utils/formatIpAndPort';

export async function updateInfoChannel(client: Client<true>) {
  const channel = await client.channels.fetch(env.DISCORD_INFO_CHANNEL_ID);

  if (!channel) {
    console.error('Info channel not found.');
    return;
  }

  if (!channel.isTextBased()) {
    console.error('Info channel is not a text channel.');
    return;
  }

  const textChannel = channel as TextChannel;

  const lastMessages = await textChannel.messages.fetch();

  await Bluebird.mapSeries(lastMessages.values(), async (message) => message.delete());

  await textChannel.send('**Server Information**');

  await Bluebird.mapSeries(serversConfig, async (serverConfig) => {
    const button = new ButtonBuilder().setLabel(serverConfig.name).setStyle(ButtonStyle.Primary);

    registerButtonHandler(button, async (buttonInteraction) => {
      const password = await getPassword(serverConfig.serverId);
      const ipAndPort = formatIpAndPort(serverConfig.ip, serverConfig.port);

      await buttonInteraction.reply({
        content: `||\`\`${ipAndPort}; password ${password}\`\`||`,
        flags: MessageFlags.Ephemeral,
      });
    });

    const rows = new ActionRowBuilder<ButtonBuilder>().addComponents(button);

    await textChannel.send({
      components: [rows],
    });
  });

  console.log('Info channel updated.');
}
