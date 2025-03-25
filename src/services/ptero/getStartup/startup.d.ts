export interface StartupResponse {
  object: string;
  data: Daum[];
  meta: Meta;
}

export interface Daum {
  object: string;
  attributes: Attributes;
}

export interface Attributes {
  name: string;
  description: string;
  env_variable: string;
  default_value: string;
  server_value: string;
  is_editable: boolean;
  rules: string;
}

export interface Meta {
  startup_command: string;
  raw_startup_command: string;
}
