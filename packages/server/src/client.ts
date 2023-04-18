import type { AddressDetails, GetAssetResult, NetworkName } from '@onix/schemas';
import { assets } from '@onix/utils';
import { BigNumber } from 'bignumber.js';
import type { ERC20ActivityParams } from './schemas';
import { take, toBaseUnit } from './utils';
import { Alchemy } from './providers/alchemy';
import { Etherscan } from './providers/etherscan';
import { CoinMarketCap } from './providers/coinmarketcap';
import type { Config } from './config';

type ClientConfig = Config['providers'];

export class Client {
  alchemy: Alchemy;
  etherscan: Etherscan;
  coinmarketcap: CoinMarketCap;

  constructor(config: ClientConfig) {
    this.alchemy = new Alchemy({ networks: config.alchemy });
    this.etherscan = new Etherscan({ networks: config.etherscan });
    this.coinmarketcap = new CoinMarketCap(config.coinmarketcap);
  }

  async getEtherBalance(
    address: string,
    network: NetworkName,
  ): Promise<AddressDetails['etherBalance']> {
    const [etherBalance, etherPrice] = await Promise.all([
      this.etherscan.getEtherBalance(address, network),
      this.etherscan.getEtherPrices(network),
    ]);
    return {
      token: toBaseUnit(etherBalance, 18).toFixed(4),
      usd: toBaseUnit(etherBalance, 18).times(etherPrice.ethusd).toFixed(2),
    };
  }

  async getEtherActivity(address: string, network: NetworkName): Promise<GetAssetResult> {
    const balance = await this.getEtherBalance(address, network);
    const txs = await this.etherscan.getNormalTransactions(address, network);
    return {
      name: 'Ether',
      symbol: 'ETH',
      address: '',
      balance,
      transfers: txs.map((tx) => ({
        from: tx.from,
        to: tx.to,
        hash: tx.hash,
        blockHash: tx.blockHash,
        blockNumber: tx.blockNumber,
        gas: tx.gas,
        gasUsed: tx.gasUsed,
        gasPrice: tx.gasPrice,
        nonce: tx.nonce,
        value: toBaseUnit(tx.value, 18).toFixed(4),
        timeStamp: tx.timeStamp,
        tokenName: 'Ether',
        tokenSymbol: 'ETH',
        tokenDecimal: '18',
        confirmations: tx.confirmations,
        contractAddress: '',
        transactionIndex: tx.transactionIndex,
        cumulativeGasUsed: tx.cumulativeGasUsed,
      })),
    };
  }

  async getAsset(params: ERC20ActivityParams, network: NetworkName): Promise<GetAssetResult> {
    if (params.contractAddressOrSymbol.toLowerCase() === 'eth') {
      return this.getEtherActivity(params.userAddress, network);
    }
    const asset = assets.find((asset) => {
      return asset.address.toLowerCase() === params.contractAddressOrSymbol.toLowerCase();
    });

    if (!asset) {
      throw new Error('Asset not found');
    }

    const [balance, [price]] = await Promise.all([
      this.etherscan.getERC20Balance(params.userAddress, params.contractAddressOrSymbol, network),
      this.coinmarketcap.getTokenPrices([asset.symbol]),
    ]);

    const transfers = await this.etherscan.getERC20Transfers(
      params.userAddress,
      params.contractAddressOrSymbol,
      network,
    );

    transfers.forEach((transfer) => {
      transfer.value = toBaseUnit(transfer.value, asset.decimals).toFixed(2);
    });

    return {
      name: asset.name,
      symbol: asset.symbol,
      address: asset.address,
      balance: {
        token: toBaseUnit(balance, asset.decimals).toFixed(4),
        usd: toBaseUnit(balance, asset.decimals).times(price.quote.USD.price).toFixed(4),
      },
      transfers,
    };
  }

  async getAddressDetails(address: string, network: NetworkName): Promise<AddressDetails> {
    const [etherBalance, etherPrice] = await Promise.all([
      this.etherscan.getEtherBalance(address, network),
      this.etherscan.getEtherPrices(network),
    ]);

    // Limit to 3 assets for now due to rate limits
    const tokens = take(assets, 3);
    const tokenAddresses = tokens.map((token) => token.address);
    const balances = await this.alchemy.getERC20Balances(address, tokenAddresses, network);

    const tokensWithBalances = tokens.map((token) => {
      const asset = balances.tokenBalances.find(
        (balance) => balance.contractAddress === token.address,
      );
      return {
        ...token,
        balance: {
          token:
            asset?.tokenBalance === '0x'
              ? '0'
              : // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                toBaseUnit(Number(asset!.tokenBalance).toString(), token.decimals).toFixed(4),
          // To be set once token prices have been fetched
          usd: '0',
        },
      };
    });

    const tokenSymbols = tokens.map((token) => token.symbol);
    const tokenPrices = await this.coinmarketcap.getTokenPrices(tokenSymbols);

    tokensWithBalances.forEach((asset, index) => {
      asset.balance.usd = new BigNumber(asset.balance.token)
        .times(tokenPrices[index].quote.USD.price)
        .toFixed(2);
    });

    const result: AddressDetails = {
      address,
      etherBalance: {
        token: toBaseUnit(etherBalance, 18).toFixed(4),
        usd: toBaseUnit(etherBalance, 18).times(etherPrice.ethusd).toFixed(2),
      },
      assets: tokensWithBalances,
    };

    return result;
  }
}
