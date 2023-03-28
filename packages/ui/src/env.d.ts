/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_HOST_URL?: string | undefined;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
