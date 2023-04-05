import { type Component, For, Suspense } from 'solid-js';
import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { getAssetResultSchema } from '@onix/schemas';
import { MainLayout } from '../layouts/main';
import { ChevronLeftIcon } from '../components/icons/chevron-left';
import { ReceiveIcon } from '../components/icons/receive';
import { SendIcon } from '../components/icons/send';
import { Link } from '../components/link';
import { userStore } from '../store';
import { httpClient } from '../lib/http';
import { truncateMiddle } from '../lib/utils';

export const Asset: Component = () => {
  const { currentAccount } = userStore;
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
      <Suspense fallback={<div>Loading...</div>}>
        <div class="relative h-[180px] flex flex-col items-center justify-center">
          <Link path="/" class="absolute w-full top-0 left-0 m-3 flex items-center space-x-1">
            <ChevronLeftIcon />
            <span>{assetQuery.data?.name}</span>
          </Link>
          <span class="text-xl">
            {assetQuery.data?.balance.token} {assetQuery.data?.symbol}
          </span>
          <span class="text-sm">${assetQuery.data?.balance.usd}</span>
          <div class="w-full flex items-center justify-around my-4">
            <button
              type="button"
              class="w-[156px] h-[38px] flex items-center justify-center space-x-2 border-[0.3px] border-zinc-700 rounded-sm"
            >
              <ReceiveIcon class="w-[12px] h-[12px]" />
              <span class="uppercase">receive</span>
            </button>
            <button
              type="button"
              class="w-[156px] h-[38px] flex items-center justify-center space-x-2 border-[0.3px] border-zinc-700 rounded-sm"
            >
              <SendIcon class="w-[12px] h-[12px]" />
              <span class="uppercase">send</span>
            </button>
          </div>
        </div>
        <span class="ml-3 text-lg uppercase">Activity</span>
        <ul class="max-h-[250px] mt-3 px-3 space-y-3 overflow-hidden overflow-y-scroll">
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
                    class="flex flex-col space-y-1"
                  >
                    <div class="flex items-center space-x-2">
                      {isSender ? (
                        <SendIcon class="w-[21px] h-[21px] p-1 rounded-full bg-zinc-700/60 border-[0.6px] border-zinc-700" />
                      ) : (
                        <ReceiveIcon class="w-[21px] h-[21px] p-1 rounded-full bg-zinc-700/60 border-[0.6px] border-zinc-700" />
                      )}
                      <span class="capitalize">{isSender ? 'sent' : 'received'}</span>
                    </div>
                    <div class="flex items-center space-x-1 text-sm text-zinc-500">
                      <span>{formattedDate}</span>
                      <span class="h-[3px] w-[3px] rounded-full bg-zinc-700" />
                      <span class="capitalize">
                        {isSender ? 'to' : 'from'} {truncateMiddle(transfer.to, 11)}
                      </span>
                    </div>
                  </a>
                  <div class="flex flex-col">
                    <span>{transfer.value}</span>
                  </div>
                </li>
              );
            }}
          </For>
        </ul>
      </Suspense>
    </MainLayout>
  );
};
