import { Component, For, Suspense } from 'solid-js';
import { createQuery } from '@tanstack/solid-query';
import { addressDetailsSchema } from '@onix/schemas';
import { request } from '../lib/api';

export const Home: Component = () => {
  const user = createQuery({
    queryKey: () => ['address'],
    queryFn: async () => {
      const address = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';
      return request({ url: `/address/${address}`, schema: addressDetailsSchema });
    },
  });

  return (
    <div>
      <h1>Home page</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <For each={user.data?.assets}>{(asset) => asset.name}</For>
      </Suspense>
    </div>
  );
};
