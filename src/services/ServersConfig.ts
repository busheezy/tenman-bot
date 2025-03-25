import * as path from 'node:path';
import * as fs from 'node:fs';

const serversConfigPath = path.join(__dirname, '..', '..', 'serversConfig.json');

interface ServersConfigEntry {
  name: string;
  serverId: string;
}

export type ServersConfig = ServersConfigEntry[];

export const serversConfig = JSON.parse(
  fs.readFileSync(serversConfigPath, 'utf8'),
) as ServersConfig;
