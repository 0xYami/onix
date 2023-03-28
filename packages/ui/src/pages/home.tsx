import { Component, For, Suspense } from 'solid-js';
import { createQuery } from '@tanstack/solid-query';
import { addressDetailsSchema } from '@onix/schemas';
import { request } from '../lib/api';
import { ReceiveIcon } from '../icons/receive';
import { SendIcon } from '../icons/send';

export const Home: Component<{ address: string }> = (props) => {
  const userQuery = createQuery({
    queryKey: () => ['address'],
    queryFn: async () => {
      const res = await request({
        url: `/address/${props.address}`,
        schema: addressDetailsSchema,
      });
      console.log(res);
      return res;
    },
    enabled: !!props.address,
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div class="h-[150px] flex flex-col items-center justify-center">
        <div class="text-lg uppercase">total balance</div>
        <div class="text-2xl font-bold">${userQuery.data?.balance}</div>
        <div class="w-full flex items-center justify-around my-4">
          <button
            type="button"
            class="w-[156px] h-[38px] flex items-center justify-center space-x-2 border-[0.3px] border-zinc-700 rounded-sm"
          >
            <ReceiveIcon />
            <span class="uppercase">receive</span>
          </button>
          <button
            type="button"
            class="w-[156px] h-[38px] flex items-center justify-center space-x-2 border-[0.3px] border-zinc-700 rounded-sm"
          >
            <SendIcon />
            <span class="uppercase">send</span>
          </button>
        </div>
      </div>
      <div class="px-3">
        <div class="pb-2 uppercase">tokens</div>
        <ul class="flex flex-col space-y-2">
          <For each={userQuery.data?.assets}>
            {(asset) => (
              <li class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <img src="/eth.svg" alt="logo" class="w-[40px] h-[40px]" />
                  <div class="flex flex-col">
                    <span class="font-bold">
                      {asset.balance.token} {asset.symbol}
                    </span>
                    <span class="text-xs text-zinc-400">{asset.name}</span>
                  </div>
                </div>
                <span>${asset.balance.value}</span>
              </li>
            )}
          </For>
        </ul>
      </div>
    </Suspense>
  );
};
