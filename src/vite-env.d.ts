/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_INQUIRY_RECIPIENT_EMAIL?: string;
  readonly [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
