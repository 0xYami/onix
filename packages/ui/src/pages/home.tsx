import { createMemo, For, Suspense, type Component } from 'solid-js';
import { createQuery } from '@tanstack/solid-query';
import { addressDetailsSchema, type AddressDetails } from '@onix/schemas';
import { request } from '../lib/api';
import { assetSymbolToLogoURL } from '../lib/utils';

export const Home: Component<{ address: string }> = (props) => {
  const userQuery = createQuery({
    queryKey: () => ['address'],
    queryFn: async () => {
      return request({
        url: `/address/${props.address}`,
        schema: addressDetailsSchema,
      });
    },
    enabled: !!props.address,
  });

  const assets = createMemo(() => {
    if (!userQuery.data) return [];
    const result: AddressDetails['assets'] = [
      {
        name: 'Ethereum',
        symbol: 'ETH',
        address: '',
        balance: userQuery.data.etherBalance,
      },
      ...userQuery.data.assets,
    ];
    return result;
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div class="h-[150px] flex flex-col items-center justify-center">
        <div class="text-lg uppercase">total balance</div>
        <div class="text-2xl font-bold">${userQuery.data?.totalBalance}</div>
        <div class="w-full flex items-center justify-around my-4">
          <button
            type="button"
            class="w-[156px] h-[38px] flex items-center justify-center space-x-2 border-[0.3px] border-zinc-700 rounded-sm"
          >
            <img src="/icons/receive.svg" alt="Receive Icon" class="w-[12px] h-[12px]" />
            <span class="uppercase">receive</span>
          </button>
          <button
            type="button"
            class="w-[156px] h-[38px] flex items-center justify-center space-x-2 border-[0.3px] border-zinc-700 rounded-sm"
          >
            <img src="/icons/send.svg" alt="Send Icon" class="w-[12px] h-[12px]" />
            <span class="uppercase">send</span>
          </button>
        </div>
      </div>
      <div class="px-3">
        <div class="pb-3 uppercase">tokens</div>
        <ul class="flex flex-col space-y-6">
          <For each={assets()}>
            {(asset) => (
              <li class="flex items-start justify-between">
                <div class="flex items-center space-x-3">
                  <img
                    src={`${assetSymbolToLogoURL[asset.symbol]}`}
                    alt={`${asset.name} Icon`}
                    class="w-[40px] h-[40px]"
                  />
                  <div class="flex flex-col">
                    <span class="font-bold">
                      {asset.balance.token} {asset.symbol}
                    </span>
                    <span class="text-xs text-zinc-400">{asset.name}</span>
                  </div>
                </div>
                <span>${asset.balance.usd}</span>
              </li>
            )}
          </For>
        </ul>
      </div>
    </Suspense>
  );
};
