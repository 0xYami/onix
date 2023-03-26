import { createQuery } from '@tanstack/solid-query';
import { Component, For, Match, Switch } from 'solid-js';

export const Home: Component = () => {
  const user = createQuery({
    queryKey: () => ['address'],
    queryFn: async () => {
      const address = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';
      const res = await fetch(`http://localhost:4000/address/${address}`);
      if (!res.ok) throw new Error('Failed to retrieve address information');
      const data = await res.json();
      return data;
    },
  });

  return (
    <div>
      <h1>Home page</h1>
      <Switch>
        <Match when={user.isLoading}>
          <p>Loading...</p>
        </Match>
        <Match when={user.isError}>
          <p>Error occured</p>
        </Match>
        <Match when={user.isSuccess}>
          <For each={user.data}>
            {(token) => <p>{token.name}</p>}
          </For>
        </Match>
      </Switch>
    </div>
  );
};
