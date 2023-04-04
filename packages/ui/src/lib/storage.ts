import { z } from '@onix/schemas';

const userState = z.object({
  password: z.string().min(8),
  mnemonic: z.string(),
  address: z.string(),
});

export type UserStorage = z.infer<typeof userState>;

function createStorage() {
  const userStorageKey = 'onix-user-secrets';

  const getUserState = (): UserStorage | null => {
    const rawValue = localStorage.getItem(userStorageKey);
    if (!rawValue) return null;
    const state = userState.safeParse(JSON.parse(rawValue));
    if (!state.success) return null;
    return state.data;
  };

  const setUserState = (state: UserStorage) => {
    let address = state.address;
    // FIX: This is Vitalik address, we use it in dev in order to have assets to display
    if (import.meta.env.DEV) {
      address = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';
    }
    localStorage.setItem(
      userStorageKey,
      JSON.stringify({
        password: state.password,
        mnemonic: state.mnemonic,
        address,
      }),
    );
  };

  return { getUserState, setUserState };
}

export const storage = createStorage();
