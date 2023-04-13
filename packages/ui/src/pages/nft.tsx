import { type Component, Suspense, For, Show } from 'solid-js';
import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { alchemyNFTSchema } from '@onix/schemas';
import { store } from '~/lib/store';
import { httpClient } from '~/lib/http';
import { MainLayout } from '~/layouts/main';
import { Link } from '~/components/link';
import { ChevronLeftIcon } from '~/components/icons/chevron-left';

export const NFT: Component = () => {
  const { currentAccount } = store;
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
      <Suspense fallback={<Skeleton />}>
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

const Skeleton: Component = () => (
  <div class="p-4 space-y-3 bg-white/5 animate-pulse">
    <div class="h-8 rounded bg-zinc-700/20" />
    <div class="h-80 w-80 mx-auto rounded bg-zinc-700/20" />
    <div class="h-8 w-2/5 rounded bg-zinc-700/20" />
    <div class="h-10 grid grid-cols-2 gap-4 overflow-y-hidden">
      {Array(6)
        .fill(0)
        .map(() => (
          <div class="h-12 rounded bg-zinc-700/20" />
        ))}
    </div>
  </div>
);
