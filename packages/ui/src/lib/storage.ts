import { z } from '@onix/schemas';

const account = z.object({
  name: z.string(),
  address: z.string(),
});

const userStorage = z.object({
  password: z.string().min(8),
  mnemonic: z.string(),
  currentAccount: account,
  accounts: z.array(account).nonempty(),
});

export type Account = z.infer<typeof account>;
type UserStorage = z.infer<typeof userStorage>;

function createStorage() {
  const userStorageKey = 'onix-user-secrets';

  const getUserState = (): UserStorage | null => {
    const rawValue = localStorage.getItem(userStorageKey);
    if (!rawValue) return null;
    const state = userStorage.safeParse(JSON.parse(rawValue));
    if (!state.success) return null;
    return state.data;
  };

  const setUserState = (state: UserStorage) => {
    localStorage.setItem(
      userStorageKey,
      JSON.stringify({
        password: state.password,
        mnemonic: state.mnemonic,
        currentAccount: state.currentAccount,
        accounts: state.accounts,
      }),
    );
  };

  return { getUserState, setUserState };
}

export const storage = createStorage();
