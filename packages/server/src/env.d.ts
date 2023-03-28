declare namespace NodeJS {
  interface ProcessEnv {
    PORT?: string | undefined;
    ALCHEMY_API_KEY?: string | undefined;
    COINMARKETCAP_API_KEY?: string | undefined;
  }
}
