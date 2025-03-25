export interface PteroServerResponse {
  object: string;
  attributes: Attributes;
  meta: Meta;
}

interface Attributes {
  server_owner: boolean;
  identifier: string;
  uuid: string;
  name: string;
  node: string;
  sftp_details: SftpDetails;
  description: string;
  limits: Limits;
  feature_limits: FeatureLimits;
  is_suspended: boolean;
  is_installing: boolean;
  relationships: Relationships;
}

interface SftpDetails {
  ip: string;
  port: number;
}

interface Limits {
  memory: number;
  swap: number;
  disk: number;
  io: number;
  cpu: number;
}

interface FeatureLimits {
  databases: number;
  allocations: number;
  backups: number;
}

interface Relationships {
  allocations: Allocations;
}

interface Allocations {
  object: string;
  data: Daum[];
}

interface Daum {
  object: string;
  attributes: Attributes2;
}

interface Attributes2 {
  id: number;
  ip: string;
  ip_alias: string | null;
  port: number;
  notes?: string;
  is_default: boolean;
}

interface Meta {
  is_server_owner: boolean;
  user_permissions: string[];
}
