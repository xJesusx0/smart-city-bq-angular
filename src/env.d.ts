/// <reference types="@ngx-env/builder" />

interface ImportMetaEnv {
  readonly NG_APP_API_URL: string;
  readonly NG_APP_GOOGLE_CLIENT_ID: string;
  readonly NG_APP_MSAL_CLIENT_ID: string;
  readonly NG_APP_MSAL_TENANT_ID: string;
  // Standard flags
  readonly PROD: boolean;
  readonly DEV: boolean;
  readonly MODE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
