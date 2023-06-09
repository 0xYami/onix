import { type Component, Suspense, For } from 'solid-js';
import { createQuery } from '@tanstack/solid-query';
import { getNFTCollectionsResponseSchema } from '@onix/schemas';
import { store } from '~/store';
import { httpClient } from '~/lib/http';
import { MainLayout } from '~/layouts/main';
import { Link } from '~/components/link';

export const Collections: Component = () => {
  const collectionsQuery = createQuery({
    queryKey: () => ['collections', store.currentAccount.address, store.currentNetwork],
    queryFn: async () => {
      return httpClient.get({
        url: `/users/${store.currentAccount.address}/nfts/collections`,
        options: {
          params: { network: store.currentNetwork },
        },
        validation: {
          response: getNFTCollectionsResponseSchema,
        },
      });
    },
    enabled: !!store.currentAccount.address,
  });

  return (
    <MainLayout>
      <div class="flex flex-col p-3 space-y-2">
        <span class="flex items-center justify-start h-14 text-xl">NFT Portfolio</span>
        <Suspense fallback={<Skeleton />}>
          <span class="pb-2 text-zinc-100">
            {collectionsQuery.data?.totalCount}{' '}
            {collectionsQuery.data && collectionsQuery.data.totalCount > 1
              ? 'collections'
              : 'collection'}
          </span>
          <ul class="h-80 overflow-y-scroll pt-2 space-y-4">
            <For each={collectionsQuery.data?.contracts}>
              {(collection) => (
                <li class="p-1 cursor-pointer rounded hover:bg-zinc-700/40">
                  <Link path={`/collections/${collection.address}`} class="flex space-x-4">
                    <img
                      src={collection.opensea?.imageUrl}
                      alt={`image-${collection.name}`}
                      class="w-12 h-12 rounded-full"
                    />
                    <div>
                      <div>{collection.name}</div>
                      <div class="text-sm text-zinc-400">
                        {collection.totalBalance} {collection.totalBalance > 1 ? 'NFTs' : 'NFT'}
                      </div>
                    </div>
                  </Link>
                </li>
              )}
            </For>
          </ul>
        </Suspense>
      </div>
    </MainLayout>
  );
};

const Skeleton: Component = () => (
  <div class="space-y-3 animate-pulse">
    <div class="h-8 w-2/5 rounded-lg bg-zinc-700/20" />
    <div class="h-14 flex items-center px-2 rounded-lg bg-zinc-700/20">
      <div class="w-12 h-12 rounded-full bg-zinc-700/50" />
    </div>
    <div class="h-14 flex items-center px-2 rounded-lg bg-zinc-700/20">
      <div class="w-12 h-12 rounded-full bg-zinc-700/50" />
    </div>
    <div class="h-14 flex items-center px-2 rounded-lg bg-zinc-700/20">
      <div class="w-12 h-12 rounded-full bg-zinc-700/50" />
    </div>
    <div class="h-14 flex items-center px-2 rounded-lg bg-zinc-700/20">
      <div class="w-12 h-12 rounded-full bg-zinc-700/50" />
    </div>
    <div class="h-14 flex items-center px-2 rounded-lg bg-zinc-700/20">
      <div class="w-12 h-12 rounded-full bg-zinc-700/50" />
    </div>
  </div>
);
