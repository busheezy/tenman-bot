import { GuildMember } from 'discord.js';
import { env } from '../env';

export function isCaptain(member: GuildMember) {
  return member.roles.cache.find((role) => role.name === env.DISCORD_CAPTAIN_ROLE_NAME);
}
