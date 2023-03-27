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
        <div class="text-2xl font-bold">${userQuery.data?.balance.price}</div>
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
      <div>
        <For each={userQuery.data?.assets}>{(asset) => asset.name}</For>
      </div>
    </Suspense>
  );
};
