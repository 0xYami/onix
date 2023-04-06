import { type Component, Suspense, For, Show } from 'solid-js';
import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { alchemyNFTSchema } from '@onix/schemas';
import { MainLayout } from '../layouts/main';
import { Link } from '../components/link';
import { ChevronLeftIcon } from '../components/icons/chevron-left';
import { userStore } from '../store';
import { httpClient } from '../lib/http';

export const NFT: Component = () => {
  const { currentAccount } = userStore;
  const params = useParams<{ contractAddress: string; tokenId: string }>();

  const nftQuery = createQuery({
    queryKey: () => ['nft', currentAccount?.address, params.contractAddress, params.tokenId],
    queryFn: async () => {
      return httpClient.get({
        url: `/users/${currentAccount?.address}/collections/${params.contractAddress}/${params.tokenId}`,
        validation: {
          response: alchemyNFTSchema,
        },
      });
    },
    enabled: !!currentAccount?.address,
  });

  return (
    <MainLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <Link
          path={`/collections/${params.contractAddress}`}
          class="flex items-center p-3 mb-2 space-x-1"
        >
          <ChevronLeftIcon />
          <span>
            {nftQuery.data?.contractMetadata.name} / #{nftQuery.data?.id.tokenId}
          </span>
        </Link>
        <div class="h-96 flex flex-col justify-center px-3 space-y-4 overflow-y-scroll">
          <img
            src={nftQuery.data?.metadata.image}
            alt={`NFT ${nftQuery.data?.id.tokenId}`}
            class="h-80 w-80 px-2 mx-auto"
          />
          <Show when={nftQuery.data?.metadata.attributes} fallback={<span>No attribute</span>}>
            {(attributes) => (
              <span class="px-3 uppercase">
                {attributes().length} {attributes().length > 1 ? 'attributes' : 'attribute'}
              </span>
            )}
          </Show>
          <ul class="px-3 grid grid-cols-2 gap-2">
            <For each={nftQuery.data?.metadata.attributes}>
              {(attribute) => (
                <li class="flex flex-col p-2 space-y-1 border border-zinc-700 rounded">
                  <span class="text-sm text-zinc-300">{attribute.trait_type}</span>
                  <span>{attribute.value}</span>
                </li>
              )}
            </For>
          </ul>
        </div>
      </Suspense>
    </MainLayout>
  );
};
