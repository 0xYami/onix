import { type Component, Suspense } from "solid-js";
import { useParams } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { alchemyNFTSchema } from "@onix/schemas";
import { Link } from "../components/link";
import { ChevronLeftIcon } from "../components/icons/chevron-left";
import { request } from "../lib/api";

export const NFT: Component<{ address: string }> = (props) => {
  const params = useParams<{ contractAddress: string, tokenId: string }>();

  const nftQuery = createQuery({
    queryKey: () => ["nft", props.address, params.contractAddress, params.tokenId],
    queryFn: async () => {
      return request({
        url: `/users/${props.address}/collections/${params.contractAddress}/${params.tokenId}`,
        schema: alchemyNFTSchema,
      })
    }
  });

  console.log(nftQuery.data)

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div class="flex flex-col justify-center p-3 space-y-4">
        <Link
          path={`/collections`}
          class="flex items-center space-x-1"
        >
          <ChevronLeftIcon />
          <span>{nftQuery.data?.contractMetadata.name} / #{nftQuery.data?.id.tokenId}</span>
        </Link>
        <img src={nftQuery.data?.metadata.image} alt={`NFT ${nftQuery.data?.id.tokenId}`} class="p-2" />
      </div>
    </Suspense>
  )
}
