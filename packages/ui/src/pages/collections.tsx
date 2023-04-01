import { type Component, Suspense } from 'solid-js';
import { createQuery } from '@tanstack/solid-query';
import { getNFTCollectionsResponseSchema } from '@onix/schemas';
import { Link } from '../components/link';
import { httpClient } from '../lib/http';

export const Collections: Component<{ address: string }> = (props) => {
  const collectionsQuery = createQuery({
    queryKey: () => ['collections', props.address],
    queryFn: async () => {
      return httpClient.get({
        url: `/users/${props.address}/nfts/collections`,
        schema: getNFTCollectionsResponseSchema,
      });
    },
  });

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div class="flex flex-col p-3 space-y-2">
        <span class="flex items-center justify-start h-[60px] text-xl">NFT Portfolio</span>
        <span class="text-zinc-100">
          {collectionsQuery.data?.totalCount}{' '}
          {collectionsQuery.data && collectionsQuery.data.totalCount > 1
            ? 'collections'
            : 'collection'}
        </span>
        <ul class="h-[360px] overflow-y-scroll pt-2 space-y-4">
          {collectionsQuery.data?.contracts?.map((collection) => (
            <li class="p-1 cursor-pointer rounded hover:bg-zinc-700/40">
              <Link path={`/collections/${collection.address}`} class="flex space-x-4">
                <img
                  src={collection.opensea?.imageUrl}
                  alt={`image-${collection.name}`}
                  class="w-[50px] h-[50px] rounded-full"
                />
                <div class="flex flex-col">
                  <span>{collection.name}</span>
                  <span class="text-sm text-zinc-400">
                    {collection.totalBalance} {collection.totalBalance > 1 ? 'NFTs' : 'NFT'}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Suspense>
  );
};
