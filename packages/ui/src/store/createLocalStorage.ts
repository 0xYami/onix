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
  const [state, setState] = createStore(config.initialState);

  const storedState = localStorage.getItem(config.storageKey);
  if (storedState) {
    const result = config.schema.safeParse(JSON.parse(storedState));
    if (result.success) setState(result.data);
  }

  createEffect(() => {
    localStorage.setItem(config.storageKey, JSON.stringify(state));
  });

  return [state, setState];
}
