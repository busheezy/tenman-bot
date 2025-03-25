import { getStartup } from './getStartup';

export async function getPassword(serverId: string) {
  const startupResponse = await getStartup(serverId);

  const passwordData = startupResponse.data.find(
    (data) => data.attributes.env_variable === 'PASSWORD',
  );

  const password = passwordData ? passwordData.attributes.server_value : null;

  return password;
}
