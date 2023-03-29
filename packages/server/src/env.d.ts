declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ProcessEnv {
    HOST?: string | undefined;
    PORT?: string | undefined;
    ETHERSCAN_API_KEY?: string | undefined;
    COINMARKETCAP_API_KEY?: string | undefined;
  }
}
