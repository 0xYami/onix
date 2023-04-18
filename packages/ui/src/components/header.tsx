import { createSignal, For, Show, Suspense, type Component } from 'solid-js';
import { Portal } from 'solid-js/web';
import { createQuery } from '@tanstack/solid-query';
import { etherscanGasPricesSchema, networkNames } from '@onix/schemas';
import { store, storeActions } from '~/store';
import { httpClient } from '~/lib/http';
import { truncateMiddleString } from '~/lib/utils';
import { Link } from './link';
import { Copy } from './copy';
import { GasPumpIcon } from './icons/gas-pump';
import { CopyIcon } from './icons/copy';

export const Header: Component = () => {
  const [networksOpen, setNetworksOpen] = createSignal(false);

  // Gas prices are in Gwei
  const gasPricesQuery = createQuery({
    queryKey: () => ['gasPrices', store.currentNetwork],
    queryFn: async () => {
      return httpClient.get({
        url: '/gas-prices',
        options: {
          params: { network: store.currentNetwork },
        },
        validation: {
          response: etherscanGasPricesSchema,
        },
      });
    },
  });

  return (
    <header class="relative h-12 flex items-center px-4 space-x-2 border-b-thin border-zinc-700 text-xs">
      <button
        type="button"
        onClick={() => setNetworksOpen(true)}
        class="flex items-center space-x-1 hover:text-zinc-400"
      >
        <div class="w-2 h-2 rounded-full bg-green-600" />
        <span class="font-bold uppercase">{store.currentNetwork}</span>
      </button>
      <Show when={networksOpen()}>
        <Portal>
          <div
            class="absolute w-[360px] h-[540px] inset-0 m-auto pt-10 pl-4"
            onClick={() => setNetworksOpen(false)}
          >
            <ul class="w-40 h-28 flex flex-col justify-between bg-zinc-900 text-white py-3 px-2 border-thin border-zinc-700 rounded shadow-md z-10">
              <For each={networkNames}>
                {(network) => (
                  <li>
                    <button
                      type="button"
                      onClick={() => storeActions.switchNetwork(network)}
                      class="w-full h-full flex items-center p-1 space-x-2 rounded hover:bg-black"
                    >
                      <div
                        classList={{
                          'w-2 h-2 rounded-full': true,
                          'bg-green-600': network === store.currentNetwork,
                          'bg-zinc-400': network !== store.currentNetwork,
                        }}
                      />
                      <span class="text-sm capitalize">{network}</span>
                    </button>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </Portal>
      </Show>
      <div class="flex items-center space-x-2">
        <GasPumpIcon class="w-3 h-3" />
        <Suspense fallback={<span>---</span>}>
          <span>{gasPricesQuery.data?.SafeGasPrice} Gwei</span>
        </Suspense>
      </div>
      <div class="absolute right-4 flex items-center space-x-2">
        <Copy value={store.currentAccount.address}>
          <>
            <CopyIcon class="w-3 h-3" />
            <span>{truncateMiddleString(store.currentAccount.address, 11)}</span>
          </>
        </Copy>
        <Link path="/settings" class="w-6 h-6 rounded-full bg-zinc-700" />
      </div>
    </header>
  );
};
