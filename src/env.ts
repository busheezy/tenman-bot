import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  PTERO_URL: z.string().url(),
  PTERO_API_KEY: z.string(),
  DISCORD_CLIENT_ID: z.string(),
  DISCORD_TOKEN: z.string(),
  DISCORD_GUILD_ID: z.string(),
  DISCORD_CAPTAIN_ROLE_NAME: z.string(),
  DISCORD_INFO_CHANNEL_ID: z.string(),
});

export const env = envSchema.parse(process.env);
