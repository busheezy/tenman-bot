import * as path from 'node:path';
import * as fs from 'node:fs';

const serversConfigPath = path.join(__dirname, '..', '..', 'serversConfig.json');

interface ServersConfigEntry {
  name: string;
  serverId: string;
  ip: string;
  port?: number;
}

export type ServersConfig = ServersConfigEntry[];

export const serversConfig = JSON.parse(
  fs.readFileSync(serversConfigPath, 'utf8'),
) as ServersConfig;

export function getServerById(serverId: string): ServersConfigEntry | undefined {
  return serversConfig.find((server) => server.serverId === serverId);
}
