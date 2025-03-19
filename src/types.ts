import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export interface TenmanBotCommand {
  data: SlashCommandBuilder;
  execute: (interaction: CommandInteraction) => Promise<void>;
}
