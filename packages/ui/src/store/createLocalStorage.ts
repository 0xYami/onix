import { createEffect } from 'solid-js';
import { createStore, type SetStoreFunction, type Store } from 'solid-js/store';
import type { z, ZodSchema } from '@onix/schemas';

type CreateLocalStorageConfig<S extends ZodSchema> = {
  storageKey: string;
  schema: S;
  initialState: z.infer<S>;
};

export function createLocalStorage<S extends ZodSchema>(
  config: CreateLocalStorageConfig<S>,
): [Store<z.infer<S>>, SetStoreFunction<z.infer<S>>] {
  let initialState: z.infer<S> = config.initialState;

  const rawState = localStorage.getItem(config.storageKey);
  if (rawState) {
    const result = config.schema.safeParse(JSON.parse(rawState));
    if (result.success) initialState = result.data;
  }

  const [state, setState] = createStore(initialState);

  createEffect(() => {
    localStorage.setItem(config.storageKey, JSON.stringify(state));
  });

  return [state, setState];
}
