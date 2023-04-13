import { type Component, Suspense, For } from 'solid-js';
import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { nftCollectionSchema } from '@onix/schemas';
import { store } from '../lib/store';
import { httpClient } from '../lib/http';
import { MainLayout } from '../layouts/main';
import { Link } from '../components/link';
import { ChevronLeftIcon } from '../components/icons/chevron-left';
import { TwitterIcon } from '../components/icons/twitter';
import { DiscordIcon } from '../components/icons/discord';
import { GlobeIcon } from '../components/icons/globe';

export const Collection: Component = () => {
  const { currentAccount } = store;
  const params = useParams<{ contractAddress: string }>();

  const collectionQuery = createQuery({
    queryKey: () => ['collection', currentAccount?.address, params.contractAddress],
    queryFn: async () => {
      return httpClient.get({
        url: `/users/${currentAccount?.address}/collections/${params.contractAddress}`,
        validation: {
          response: nftCollectionSchema,
        },
      });
    },
    enabled: !!currentAccount?.address,
  });

  return (
    <MainLayout>
      <Suspense fallback={<Skeleton />}>
        <div class="flex items-center justify-between p-3">
          <Link
            path="/collections"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center space-x-1"
          >
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
                  <span class="text-sm">{nft.title}</span>
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
      {Array(6)
        .fill(0)
        .map(() => (
          <div class="w-36 h-36 rounded bg-zinc-700/20" />
        ))}
    </div>
  </div>
);
