import { ActionRowBuilder, ButtonBuilder, ButtonInteraction } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

const buttonHandlers: Record<string, (interaction: ButtonInteraction) => Promise<void>> = {};

type ButtonInteractionHandler = (interaction: ButtonInteraction) => Promise<void>;

interface RegisterButtonHandlerOptions {
  buttonDefintions: {
    button: ButtonBuilder;
    handler: ButtonInteractionHandler;
  }[];
  runOnce?: boolean;
}

export function registerButtonHandler(options: RegisterButtonHandlerOptions) {
  const { buttonDefintions, runOnce = false } = options;

  const buttonGroupIds: string[] = [];

  function deleteAllOfInteractionsButtonHandlers() {
    buttonGroupIds.forEach((buttonGroupId) => {
      delete buttonHandlers[buttonGroupId];
    });
  }

  const registeredButtons = buttonDefintions.map((buttonDefintion) => {
    const { button, handler } = buttonDefintion;
    const customId = uuidv4();

    button.setCustomId(customId);
    buttonGroupIds.push(customId);

    buttonHandlers[customId] = async (interaction: ButtonInteraction) => {
      await handler(interaction);

      if (runOnce) {
        deleteAllOfInteractionsButtonHandlers();
      }
    };

    return button;
  });

  return new ActionRowBuilder<ButtonBuilder>().addComponents(...registeredButtons);
}

export async function getButtonHandlerById(
  customId: string,
): Promise<ButtonInteractionHandler | void> {
  if (!buttonHandlers[customId]) {
    return;
  }

  return buttonHandlers[customId];
}
