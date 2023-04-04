import { type Component, Suspense, For } from 'solid-js';
import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { nftCollectionSchema } from '@onix/schemas';
import { MainLayout } from '../layouts/main';
import { Link } from '../components/link';
import { ChevronLeftIcon } from '../components/icons/chevron-left';
import { TwitterIcon } from '../components/icons/twitter';
import { DiscordIcon } from '../components/icons/discord';
import { GlobeIcon } from '../components/icons/globe';
import { userStore } from '../store';
import { httpClient } from '../lib/http';

export const Collection: Component = () => {
  const params = useParams<{ contractAddress: string }>();

  const collectionQuery = createQuery({
    queryKey: () => ['collection', userStore.address, params.contractAddress],
    queryFn: async () => {
      return httpClient.get({
        url: `/users/${userStore.address}/collections/${params.contractAddress}`,
        validation: {
          response: nftCollectionSchema,
        },
      });
    },
  });

  return (
    <MainLayout>
      <Suspense fallback={<div>Loading...</div>}>
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
        <ul class="h-[400px] overflow-y-scroll grid grid-cols-2 p-3">
          <For each={collectionQuery.data?.nfts}>
            {(nft) => (
              <li>
                <Link path={`/collections/${collectionQuery.data?.contract.address}/${nft.id}`}>
                  <img
                    src={nft.metadata.image}
                    alt={`Image ${nft.title}`}
                    class="w-[140px] h-[140px]"
                  />
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
