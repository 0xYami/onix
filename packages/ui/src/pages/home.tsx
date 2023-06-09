import { createMemo, For, Suspense, type Component } from 'solid-js';
import { createQuery } from '@tanstack/solid-query';
import { addressDetailsSchema, type AddressDetails } from '@onix/schemas';
import { store } from '~/store';
import { assetSymbolToLogoURL } from '~/lib/utils';
import { MainLayout } from '~/layouts/main';
import { SendIcon } from '~/components/icons/send';
import { ReceiveIcon } from '~/components/icons/receive';
import { Link } from '~/components/link';
import { httpClient } from '~/lib/http';

export const Home: Component = () => {
  const userQuery = createQuery({
    queryKey: () => ['address', store.currentAccount.address, store.currentNetwork],
    queryFn: async () => {
      return httpClient.get({
        url: `/users/${store.currentAccount.address}`,
        options: {
          params: { network: store.currentNetwork },
        },
        validation: {
          response: addressDetailsSchema,
        },
      });
    },
    enabled: !!store.currentAccount.address,
  });

  const assets = createMemo(() => {
    if (!userQuery.data) return [];
    const result: AddressDetails['assets'] = [
      {
        name: 'Ethereum',
        symbol: 'ETH',
        // There's no address for ethereum native asset therefore we need to use the symbol - see ONI-116
        address: 'ETH',
        balance: userQuery.data.etherBalance,
      },
      ...userQuery.data.assets,
    ];
    return result;
  });

  return (
    <MainLayout>
      <Suspense fallback={<Skeleton />}>
        <div class="h-52 flex-center flex-col">
          <img src={assetSymbolToLogoURL['ETH']} alt="eth-logo" class="w-9 h-9 my-2" />
          <div class="text-2xl">{userQuery.data?.etherBalance.token} ETH</div>
          <div>${userQuery.data?.etherBalance.usd}</div>
          <div class="w-full flex items-center justify-around my-4">
            <button
              type="button"
              class="w-40 h-10 flex-center space-x-2 border-thin border-zinc-700 rounded-sm"
            >
              <ReceiveIcon class="w-3 h-3" />
              <span class="uppercase">receive</span>
            </button>
            <button
              type="button"
              class="w-40 h-10 flex-center space-x-2 border-thin border-zinc-700 rounded-sm"
            >
              <SendIcon class="w-3 h-3" />
              <span class="uppercase">send</span>
            </button>
          </div>
        </div>
        <div class="px-3">
          <div class="pb-3 uppercase">tokens</div>
          <ul class="h-52 flex flex-col space-y-2 overflow-y-scroll">
            <For each={assets()}>
              {(asset) => (
                <li>
                  <Link
                    path={`/assets/${asset.address}`}
                    class="relative flex items-start px-1 py-2 space-x-2 rounded-lg hover:bg-zinc-700/20 hover:duration-100"
                  >
                    <img
                      src={`${assetSymbolToLogoURL[asset.symbol]}`}
                      alt={`${asset.name} Icon`}
                      class="w-10 h-10"
                    />
                    <div>
                      <div class="font-bold">
                        {asset.balance.token} {asset.symbol}
                      </div>
                      <div class="text-xs text-zinc-400">{asset.name}</div>
                    </div>
                    <div class="absolute right-0">${asset.balance.usd}</div>
                  </Link>
                </li>
              )}
            </For>
          </ul>
        </div>
      </Suspense>
    </MainLayout>
  );
};

const Skeleton: Component = () => (
  <div class="bg-white/5 p-4 animate-pulse">
    <div class="h-36 rounded-lg bg-zinc-700/20" />
    <div class="h-8 w-2/5 mt-8 mb-4 rounded-lg bg-zinc-700/20" />
    <div class="space-y-3">
      <div class="h-14 flex items-center px-4 rounded-lg bg-zinc-700/20">
        <div class="w-10 h-10 rounded-full bg-zinc-700/50" />
      </div>
      <div class="h-14 flex items-center px-4 rounded-lg bg-zinc-700/20">
        <div class="w-10 h-10 rounded-full bg-zinc-700/50" />
      </div>
      <div class="h-14 flex items-center px-4 rounded-lg bg-zinc-700/20">
        <div class="w-10 h-10 rounded-full bg-zinc-700/50" />
      </div>
      <div class="h-14 flex items-center px-4 rounded-lg bg-zinc-700/20">
        <div class="w-10 h-10 rounded-full bg-zinc-700/50" />
      </div>
    </div>
  </div>
);
