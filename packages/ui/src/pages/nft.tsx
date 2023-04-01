import { type Component, Suspense } from 'solid-js';
import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { alchemyNFTSchema } from '@onix/schemas';
import { Link } from '../components/link';
import { ChevronLeftIcon } from '../components/icons/chevron-left';
import { httpClient } from '../lib/http';

export const NFT: Component<{ address: string }> = (props) => {
  const params = useParams<{ contractAddress: string; tokenId: string }>();

  const nftQuery = createQuery({
    queryKey: () => ['nft', props.address, params.contractAddress, params.tokenId],
    queryFn: async () => {
      return httpClient.request({
        url: `/users/${props.address}/collections/${params.contractAddress}/${params.tokenId}`,
        schema: alchemyNFTSchema,
      });
    },
  });

  return (
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
      <div class="h-[380px] flex flex-col justify-center px-3 space-y-4 overflow-y-scroll">
        <img
          src={nftQuery.data?.metadata.image}
          alt={`NFT ${nftQuery.data?.id.tokenId}`}
          class="h-[300px] w-[300px] px-2"
        />
        {nftQuery.data?.metadata.attributes ? (
          <span class="px-3 uppercase">
            {nftQuery.data.metadata.attributes.length}{' '}
            {nftQuery.data.metadata.attributes.length > 1 ? 'attributes' : 'attribute'}
          </span>
        ) : (
          <span>No attribute</span>
        )}
        <ul class="px-3 grid grid-cols-2 gap-2">
          {nftQuery.data?.metadata.attributes?.map((attribute) => (
            <li class="flex flex-col p-2 space-y-1 border border-zinc-700 rounded">
              <span class="text-sm text-zinc-300">{attribute.trait_type}</span>
              <span>{attribute.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </Suspense>
  );
};
