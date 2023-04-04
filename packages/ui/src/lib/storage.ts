import { z } from '@onix/schemas';

const userState = z.object({
  password: z.string().min(8),
  mnemonic: z.string().min(8),
});

type UserStorage = z.infer<typeof userState>;

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
    localStorage.setItem(
      userStorageKey,
      JSON.stringify({
        password: state.password,
        mnemonic: state.mnemonic,
      }),
    );
  };

  return { getUserState, setUserState };
}

export const storage = createStorage();
