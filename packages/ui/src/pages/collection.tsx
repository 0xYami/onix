import { type Component, Suspense } from 'solid-js';
import { useParams } from '@solidjs/router';
import { createQuery } from '@tanstack/solid-query';
import { getNFTCollectionResponseSchema } from '@onix/schemas';
import { Link } from '../components/link';
import { ChevronLeftIcon } from '../components/icons/chevron-left';
import { TwitterIcon } from '../components/icons/twitter';
import { DiscordIcon } from '../components/icons/discord';
import { GlobeIcon } from '../components/icons/globe';
import { request } from '../lib/api';

export const Collection: Component<{ address: string }> = (props) => {
  const params = useParams<{ contractAddress: string }>();

  const collectionQuery = createQuery({
    queryKey: () => ['collection', props.address, params.contractAddress],
    queryFn: async () => {
      return request({
        url: `/users/${props.address}/collections/${params.contractAddress}`,
        schema: getNFTCollectionResponseSchema,
      });
    },
  });

  console.log(collectionQuery.data);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div class="flex items-center justify-between p-3">
        <Link
          path="/collections"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center space-x-1"
        >
          <ChevronLeftIcon />
          <span>{'Foo'}</span>
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
      <ul class="grid grid-cols-2">
        {collectionQuery.data?.ownedNfts.map((nft) => (
          <img src={`${nft.tokenUri}`} alt={`NFT ${nft.title}`} />
        ))}
      </ul>
    </Suspense>
  );
};
