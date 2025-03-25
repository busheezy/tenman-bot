import { pteroClient } from './pteroClient';

export async function setPassword(serverId: string, password: string) {
  await pteroClient.put(`/servers/${serverId}/startup/variable`, {
    key: 'PASSWORD',
    value: password,
  });

  await pteroClient.post(`/servers/${serverId}/command`, {
    command: `sv_password "${password}"`,
  });
}
