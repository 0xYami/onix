import { type Component, For, Suspense } from 'solid-js';
import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { getAssetResultSchema } from '@onix/schemas';
import { store } from '~/lib/store';
import { httpClient } from '~/lib/http';
import { truncateMiddleString } from '~/lib/utils';
import { MainLayout } from '~/layouts/main';
import { Link } from '~/components/link';
import { ChevronLeftIcon } from '~/components/icons/chevron-left';
import { ReceiveIcon } from '~/components/icons/receive';
import { SendIcon } from '~/components/icons/send';

export const Asset: Component = () => {
  const { currentAccount } = store;
  const params = useParams<{ contractAddress: string }>();

  const assetQuery = createQuery({
    queryKey: () => ['asset', currentAccount?.address, params.contractAddress],
    queryFn: async () => {
      return httpClient.get({
        url: `/users/${currentAccount?.address}/asset/erc20/${params.contractAddress}`,
        validation: {
          response: getAssetResultSchema,
        },
      });
    },
    enabled: !!currentAccount?.address && !!params.contractAddress,
  });

  return (
    <MainLayout>
      <Suspense fallback={<Skeleton />}>
        <div class="relative h-48 flex-center flex-col">
          <Link path="/" class="absolute w-full top-0 left-0 m-3 flex items-center space-x-1">
            <ChevronLeftIcon />
            <span>{assetQuery.data?.name}</span>
          </Link>
          <div class="text-xl">
            {assetQuery.data?.balance.token} {assetQuery.data?.symbol}
          </div>
          <div class="text-sm">${assetQuery.data?.balance.usd}</div>
          <div class="w-full flex items-center justify-around mt-4">
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
        <span class="ml-3 text-lg uppercase">Activity</span>
        <ul class="h-64 mt-2 px-3 space-y-3 overflow-hidden overflow-y-scroll">
          <For each={assetQuery.data?.transfers}>
            {(transfer) => {
              const isSender =
                currentAccount?.address.toLowerCase() === transfer.from.toLowerCase();
              const formattedDate = new Date(Number(transfer.timeStamp) * 1000).toLocaleDateString(
                'en-US',
                {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                },
              );
              const linkToEtherscan = `https://etherscan.io/tx/${transfer.hash}`;
              return (
                <li class="flex justify-between px-1 py-2 rounded-lg hover:bg-zinc-700/20">
                  <a
                    href={linkToEtherscan}
                    target="_blank"
                    rel="noopener noreferrer"
                    class="space-y-1"
                  >
                    <div class="flex items-center space-x-2">
                      {isSender ? (
                        <SendIcon class="w-6 h-6 p-1.5 rounded-full bg-zinc-700/60" />
                      ) : (
                        <ReceiveIcon class="w-6 h-6 p-1.5 rounded-full bg-zinc-700/60" />
                      )}
                      <span class="capitalize">{isSender ? 'sent' : 'received'}</span>
                    </div>
                    <div class="flex items-center space-x-1 text-sm text-zinc-500">
                      <span>{formattedDate}</span>
                      <span class="h-1 w-1 rounded-full bg-zinc-700" />
                      <span>
                        {isSender ? 'To' : 'From'} {truncateMiddleString(transfer.to, 11)}
                      </span>
                    </div>
                  </a>
                  {transfer.value}
                </li>
              );
            }}
          </For>
        </ul>
      </Suspense>
    </MainLayout>
  );
};

const Skeleton: Component = () => (
  <div class="bg-white/5 p-4 animate-pulse">
    <div class="flex-center">
      <div class="h-32 w-full rounded-lg bg-zinc-700/20" />
    </div>
    <div class="h-8 w-2/5 my-4 rounded-lg bg-zinc-700/20" />
    <div class="space-y-3">
      <div class="h-12 rounded-lg bg-zinc-700/20" />
      <div class="h-12 rounded-lg bg-zinc-700/20" />
      <div class="h-12 rounded-lg bg-zinc-700/20" />
      <div class="h-12 rounded-lg bg-zinc-700/20" />
    </div>
  </div>
);
