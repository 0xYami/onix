declare namespace NodeJS {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface ProcessEnv {
    NODE_ENV?: 'development' | 'production' | 'test' | undefined;
    HOST?: string | undefined;
    PORT?: string | undefined;
    ALCHEMY_MAINNET_API_KEY?: string | undefined;
    ALCHEMY_GOERLI_API_KEY?: string | undefined;
    ETHERSCAN_MAINNET_API_KEY?: string | undefined;
    ETHERSCAN_GOERLI_API_KEY?: string | undefined;
    COINMARKETCAP_API_KEY?: string | undefined;
  }
}
