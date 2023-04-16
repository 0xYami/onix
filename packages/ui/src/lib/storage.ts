import { z } from '@onix/schemas';
import { config } from './config';

const account = z.object({
  name: z.string(),
  address: z.string(),
});

const userState = z.object({
  password: z.string().min(8),
  mnemonic: z.string(),
  currentAccount: account,
  accounts: z.array(account),
  status: z.union([z.literal('logged-in'), z.literal('logged-out'), z.literal('uninitialized')]),
});

export type Account = z.infer<typeof account>;
type UserState = z.infer<typeof userState>;

function createStorage(config: { storageKey: string }) {
  const getUserState = (): UserState | null => {
    const rawValue = localStorage.getItem(config.storageKey);
    if (!rawValue) return null;
    const state = userState.safeParse(JSON.parse(rawValue));
    if (!state.success) return null;
    return state.data;
  };

  const setUserState = (state: UserState) => {
    localStorage.setItem(
      config.storageKey,
      JSON.stringify({
        password: state.password,
        mnemonic: state.mnemonic,
        currentAccount: state.currentAccount,
        accounts: state.accounts,
        status: state.status,
      }),
    );
  };

  const addUserAccount = (account: Account) => {
    const state = getUserState();
    if (!state) throw new Error('[storage] user state not initialized');
    state.accounts.push(account);
    setUserState(state);
  };

  const editAccount = (address: string, account: Account) => {
    const state = getUserState();
    if (!state) throw new Error('[storage] user state not initialized');
    if (state.currentAccount.address.toLowerCase() === address.toLowerCase()) {
      state.currentAccount = account;
    }
    state.accounts.forEach((acc) => {
      if (acc.address.toLowerCase() !== account.address.toLowerCase()) return;
      acc.name = account.name;
    });
    setUserState(state);
  };

  const removeUserAccount = (account: Account) => {
    const state = getUserState();
    if (!state) throw new Error('[storage] user state not initialized');
    const accounts = state.accounts.filter((acc) => acc.address !== account.address);
    state.accounts = accounts;
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

  const lockWallet = () => {
    const state = getUserState();
    if (!state) throw new Error('[storage] user state not initialized');
    state.status = 'logged-out';
    setUserState(state);
  };

  const unlockWallet = () => {
    const state = getUserState();
    if (!state) throw new Error('[storage] user state not initialized');
    state.status = 'logged-in';
    setUserState(state);
  };

  return {
    getUserState,
    setUserState,
    setCurrentAccount,
    addUserAccount,
    editAccount,
    removeUserAccount,
    changePassword,
    lockWallet,
    unlockWallet,
  };
}

export const storage = createStorage({
  storageKey: config.storageKey,
});
