import { pteroClient } from '../pteroClient';
import { PteroServerResponse } from './server';

export async function getPteroServer(serverId: string) {
  const { data: pteroServerResponse } = await pteroClient.get<PteroServerResponse>(
    `/servers/${serverId}`,
  );

  return pteroServerResponse;
}
