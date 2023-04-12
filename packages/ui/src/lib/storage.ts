import { z } from '@onix/schemas';

const account = z.object({
  name: z.string(),
  address: z.string(),
});

const userState = z.object({
  password: z.string().min(8),
  mnemonic: z.string(),
  currentAccount: account,
  accounts: z.array(account).nonempty(),
});

export type Account = z.infer<typeof account>;
type UserState = z.infer<typeof userState>;

function createStorage() {
  const userStorageKey = 'onix-user-secrets';

  const getUserState = (): UserState | null => {
    const rawValue = localStorage.getItem(userStorageKey);
    if (!rawValue) return null;
    const state = userState.safeParse(JSON.parse(rawValue));
    if (!state.success) return null;
    return state.data;
  };

  const setUserState = (state: UserState) => {
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

  const addUserAccount = (account: Account) => {
    const state = getUserState();
    if (!state) throw new Error('[storage] user state not initialized');
    state.accounts.push(account);
    setUserState(state);
  };

  const setCurrentAccount = (account: Account) => {
    const state = getUserState();
    if (!state) throw new Error('[storage] user state not initialized');
    state.currentAccount = account;
    setUserState(state);
  };

  const changePassword = (password: string) => {
    const state = getUserState();
    if (!state) throw new Error('[storage] user state not initialized');
    state.password = password;
    setUserState(state);
  };

  return {
    getUserState,
    setUserState,
    setCurrentAccount,
    addUserAccount,
    changePassword,
  };
}

export const storage = createStorage();
