import { pteroClient } from '../pteroClient';
import { StartupResponse } from './startup';

export async function getStartup(serverId: string) {
  const { data: startupResponse } = await pteroClient.get<StartupResponse>(
    `/servers/${serverId}/startup`,
  );

  return startupResponse;
}
