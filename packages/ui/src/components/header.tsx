import { Suspense, type Component } from 'solid-js';
import { createQuery } from '@tanstack/solid-query';
import { etherscanGasPricesSchema } from '@onix/schemas';
import { store } from '~/store';
import { httpClient } from '~/lib/http';
import { truncateMiddleString } from '~/lib/utils';
import { Link } from './link';
import { Copy } from './copy';
import { GasPumpIcon } from './icons/gas-pump';
import { CopyIcon } from './icons/copy';

export const Header: Component = () => {
  const { currentAccount } = store;

  // Gas prices are in Gwei
  const gasPricesQuery = createQuery({
    queryKey: () => ['gasPrices'],
    queryFn: async () => {
      return httpClient.get({
        url: '/gas-prices',
        validation: {
          response: etherscanGasPricesSchema,
        },
      });
    },
  });

  return (
    <header class="relative h-12 flex items-center px-4 space-x-2 border-b-thin border-zinc-700 text-xs">
      <div class="flex items-center space-x-1">
        <div class="w-2 h-2 rounded-full bg-green-600" />
        <span class="font-bold uppercase">mainnet</span>
      </div>
      <div class="flex items-center space-x-2">
        <GasPumpIcon class="w-3 h-3" />
        <Suspense fallback={<span>---</span>}>
          <span>{gasPricesQuery.data?.SafeGasPrice} Gwei</span>
        </Suspense>
      </div>
      <div class="absolute right-4 flex items-center space-x-2">
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        <Copy value={currentAccount!.address}>
          <>
            <CopyIcon class="w-3 h-3" />
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            <span>{truncateMiddleString(currentAccount!.address, 11)}</span>
          </>
        </Copy>
        <Link path="/settings" class="w-6 h-6 rounded-full bg-zinc-700" />
      </div>
    </header>
  );
};
