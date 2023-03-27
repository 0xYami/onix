import { Component, For, Suspense } from 'solid-js';
import { createQuery } from '@tanstack/solid-query';
import { addressDetailsSchema } from '@onix/schemas';
import { request } from '../lib/api';

export const Home: Component<{ address: string }> = (props) => {
  const user = createQuery({
    queryKey: () => ['address'],
    queryFn: async () => {
      const res = await request({
        url: `/address/${props.address}`,
        schema: addressDetailsSchema,
      });
      console.log(res);
      return res;
    },
    enabled: !!props.address,
  });

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <For each={user.data?.assets}>{(asset) => asset.name}</For>
      </Suspense>
    </div>
  );
};
