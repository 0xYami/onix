import { type Component, Suspense, For } from 'solid-js';
import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { nftCollectionSchema } from '@onix/schemas';
import { store } from '~/store';
import { httpClient } from '~/lib/http';
import { MainLayout } from '~/layouts/main';
import { Link } from '~/components/link';
import { ChevronLeftIcon } from '~/components/icons/chevron-left';
import { TwitterIcon } from '~/components/icons/twitter';
import { DiscordIcon } from '~/components/icons/discord';
import { GlobeIcon } from '~/components/icons/globe';

export const Collection: Component = () => {
  const params = useParams<{ contractAddress: string }>();

  const collectionQuery = createQuery({
    queryKey: () => [
      'collection',
      store.currentAccount.address,
      store.currentNetwork,
      params.contractAddress,
    ],
    queryFn: async () => {
      return httpClient.get({
        url: `/users/${store.currentAccount.address}/collections/${params.contractAddress}`,
        options: {
          params: { network: store.currentNetwork },
        },
        validation: {
          response: nftCollectionSchema,
        },
      });
    },
    enabled: !!store.currentAccount.address,
  });

  return (
    <MainLayout>
      <Suspense fallback={<Skeleton />}>
        <div class="flex-between p-3">
          <Link path="/collections" class="flex items-center space-x-1">
            <ChevronLeftIcon />
            <span>{collectionQuery.data?.contract.name}</span>
          </Link>
          <ul class="flex space-x-4">
            <li>
              <TwitterIcon />
            </li>
            <li>
              <DiscordIcon />
            </li>
            <li>
              <GlobeIcon />
            </li>
          </ul>
        </div>
        <ul class="h-96 overflow-y-scroll grid grid-cols-2 p-3">
          <For each={collectionQuery.data?.nfts}>
            {(nft) => (
              <li>
                <Link path={`/collections/${collectionQuery.data?.contract.address}/${nft.id}`}>
                  <img src={nft.metadata.image} alt={`Image ${nft.title}`} class="w-36 h-36" />
                  <div class="text-sm">{nft.title}</div>
                </Link>
              </li>
            )}
          </For>
        </ul>
      </Suspense>
    </MainLayout>
  );
};

const Skeleton: Component = () => (
  <div class="p-4 space-y-3 animate-pulse">
    <div class="h-8 rounded bg-zinc-700/20" />
    <div class="h-96 grid grid-cols-2 gap-4 overflow-y-hidden">
      <For each={Array(6).fill(0)}>{() => <div class="w-36 h-36 rounded bg-zinc-700/20" />}</For>
    </div>
  </div>
);
