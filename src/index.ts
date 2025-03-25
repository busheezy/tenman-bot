import { Client, Events, GatewayIntentBits, MessageFlags } from 'discord.js';
import { getButtonHandlerById } from './buttonHandler';
import { commandsCollection } from './commands';
import { env } from './env';
import { updateInfoChannel } from './infoChannelHandler';
import './initCommands';

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);

  await updateInfoChannel(readyClient);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = commandsCollection.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral,
      });
    } else {
      await interaction.reply({
        content: 'There was an error while executing this command!',
        flags: MessageFlags.Ephemeral,
      });
    }
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isButton()) {
    return;
  }

  const buttonHandler = await getButtonHandlerById(interaction.customId);

  if (!buttonHandler) {
    await interaction.reply({
      content: 'This action can no longer be performed. Try again.',
      flags: MessageFlags.Ephemeral,
    });

    return;
  }

  try {
    await buttonHandler(interaction);
  } catch (error) {
    console.error(error);

    await interaction.reply({
      content: 'There was an error while executing this button handler!',
      flags: MessageFlags.Ephemeral,
    });
  }
});

client.login(env.DISCORD_TOKEN);
