import { For, Match, Suspense, Switch, type Component } from 'solid-js';
import { createQuery } from '@tanstack/solid-query';
import { alchemyAssetTransfersSchema, type AlchemyAssetTransfer } from '@onix/schemas';
import { store } from '~/store';
import { httpClient } from '~/lib/http';
import { truncateMiddleString } from '~/lib/utils';
import { MainLayout } from '~/layouts/main';
import { SendIcon } from '~/components/icons/send';
import { ReceiveIcon } from '~/components/icons/receive';

export const Activity: Component = () => {
  const { currentAccount } = store;

  const activityQuery = createQuery({
    queryKey: () => ['activity', currentAccount?.address, store.currentNetwork],
    queryFn: async () => {
      return httpClient.get({
        url: `/users/${currentAccount?.address}/activity`,
        options: {
          params: { network: store.currentNetwork },
        },
        validation: {
          response: alchemyAssetTransfersSchema.transform(({ result }) => {
            return result.transfers.reduce((acc, curr) => {
              const date = new Date(curr.metadata.blockTimestamp).toDateString();
              if (acc[date]) {
                acc[date].push(curr);
              } else {
                acc[date] = [curr];
              }
              return acc;
            }, {} as Record<string, AlchemyAssetTransfer[]>);
          }),
        },
      });
    },
    enabled: !!currentAccount?.address,
  });

  return (
    <MainLayout>
      <Suspense fallback={<Skeleton />}>
        <div class="p-3 text-xl font-bold">Activity</div>
        <ul class="h-96 p-3 space-y-5 overflow-y-scroll">
          <For each={Object.entries(activityQuery.data || [])}>
            {([date, transfer]) => (
              <div class="space-y-3">
                <div>
                  {new Date(date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <ul class="space-y-1">
                  <For each={transfer}>
                    {(transfer) => {
                      const isSender =
                        transfer.from.toLowerCase() === currentAccount?.address.toLowerCase();
                      const linkToEtherscan = `https://etherscan.io/tx/${transfer.hash}`;
                      return (
                        <li class="flex-between">
                          <a
                            href={linkToEtherscan}
                            target="_blank"
                            rel="noopener noreferrer"
                            class="w-full flex space-x-2 py-2 px-1 rounded-lg hover:bg-zinc-700/50"
                          >
                            <Switch>
                              <Match when={isSender}>
                                <SendIcon class="w-10 h-10 p-3 rounded-full bg-zinc-700/60" />
                                <div>
                                  <div>Sent</div>
                                  <div class="text-sm text-zinc-400">
                                    To: {transfer.to ? truncateMiddleString(transfer.to, 11) : null}
                                  </div>
                                </div>
                              </Match>
                              <Match when={!isSender}>
                                <ReceiveIcon class="w-10 h-10 p-3 rounded-full bg-zinc-700/60" />
                                <div>
                                  <div>Received</div>
                                  <div class="text-sm text-zinc-400">
                                    From:{' '}
                                    {transfer.from ? truncateMiddleString(transfer.from, 11) : null}
                                  </div>
                                </div>
                              </Match>
                            </Switch>
                          </a>
                        </li>
                      );
                    }}
                  </For>
                </ul>
              </div>
            )}
          </For>
        </ul>
      </Suspense>
    </MainLayout>
  );
};

const Skeleton: Component = () => (
  <div class="bg-white/5 px-2 animate-pulse">
    <div class="h-10 w-2/5 my-4 rounded-lg bg-zinc-700/20" />
    <div class="h-8 w-3/5 my-4 rounded-lg bg-zinc-700/20" />
    <div class="space-y-3">
      <div class="h-10 rounded-lg bg-zinc-700/20" />
      <div class="h-10 rounded-lg bg-zinc-700/20" />
      <div class="h-10 rounded-lg bg-zinc-700/20" />
      <div class="h-10 rounded-lg bg-zinc-700/20" />
      <div class="h-10 rounded-lg bg-zinc-700/20" />
      <div class="h-10 rounded-lg bg-zinc-700/20" />
      <div class="h-10 rounded-lg bg-zinc-700/20" />
    </div>
  </div>
);
