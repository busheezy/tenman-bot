import { pteroClient } from './pteroClient';

export async function restartServer(serverIdentifier: string) {
  await pteroClient.post(`/servers/${serverIdentifier}/power`, {
    signal: 'restart',
  });
}
