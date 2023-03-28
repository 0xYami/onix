type Token = {
  name: string;
  symbol: string;
  address: string;
  decimals: number;
};

export const tokens: Token[] = [
  {
    name: 'USDT',
    symbol: 'USDT',
    address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    decimals: 6,
  },
  {
    name: 'USDC',
    symbol: 'USDC',
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    decimals: 6,
  },
  {
    name: 'DAI',
    symbol: 'DAI',
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    decimals: 18,
  },
  {
    name: 'Polygon',
    symbol: 'MATIC',
    address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0',
    decimals: 18,
  },
  {
    name: 'ChainLink',
    symbol: 'LINK',
    address: '0x514910771af9ca656af840dff83e8264ecf986ca',
    decimals: 18,
  },
  {
    name: 'Uniswap',
    symbol: 'UNI',
    address: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
    decimals: 18,
  },
  {
    name: 'Lido DAO',
    symbol: 'LDO',
    address: '0x5a98fcbea516cf06857215779fd812ca3bef1b32',
    decimals: 18,
  },
  {
    name: 'Maker',
    symbol: 'MKR',
    address: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    decimals: 18,
  },
  {
    name: 'Aave',
    symbol: 'AAVE',
    address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    decimals: 18,
  },
  {
    name: 'ApeCoin',
    symbol: 'APE',
    address: '0x4d224452801aced8b2f0aebe155379bb5d594381',
    decimals: 18,
  },
];
