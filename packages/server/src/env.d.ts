declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ProcessEnv {
    PORT?: string | undefined;
    ALCHEMY_API_KEY?: string | undefined;
    COINMARKETCAP_API_KEY?: string | undefined;
  }
}
