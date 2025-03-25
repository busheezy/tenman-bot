export function formatIpAndPort(ip: string, port: number | null | undefined) {
  const ipAndPort = port ? `connect ${ip}:${port}` : `connect ${ip}`;

  return ipAndPort;
}
