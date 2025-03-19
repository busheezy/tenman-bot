import { Collection, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { passwordCommand } from './password';
import { TenmanBotCommand } from '../types';

export const commands: TenmanBotCommand[] = [];

commands.push(passwordCommand);

export const commandsJson: RESTPostAPIChatInputApplicationCommandsJSONBody[] = commands.map(
  (command) => command.data.toJSON(),
);

export const commandsCollection = new Collection<string, TenmanBotCommand>();

for (const command of commands) {
  commandsCollection.set(command.data.name, command);
}
