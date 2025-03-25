import { ButtonBuilder, ButtonInteraction } from 'discord.js';
import { v4 as uuidv4 } from 'uuid';

const buttonHandlers: Record<string, (interaction: ButtonInteraction) => Promise<void>> = {};

type ButtonInteractionHandler = (interaction: ButtonInteraction) => Promise<void>;

export function registerButtonHandler(
  buttonBuilder: ButtonBuilder,
  handler: ButtonInteractionHandler,
): ButtonBuilder {
  const customId = uuidv4();

  buttonBuilder.setCustomId(customId);
  buttonHandlers[customId] = handler;

  return buttonBuilder;
}

export async function getButtonHandlerById(
  customId: string,
): Promise<ButtonInteractionHandler | void> {
  if (!buttonHandlers[customId]) {
    return;
  }

  return buttonHandlers[customId];
}
