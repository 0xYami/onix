import { createStore } from 'solid-js/store';
import type { Account } from './storage';

type UserState = {
  password: string | null;
  mnemonic: string | null;
  accounts: Account[] | null;
  currentAccount: Account | null;
  status: 'logged-in' | 'logged-out' | 'uninitialized';
};

type UserActions = {
  initialize: (state: UserState) => void;
  addAccount: (account: Account) => void;
  switchAccount: (account: Account) => void;
  changePassword: (password: string) => void;
  lockWallet: () => void;
  unlockWallet: () => void;
};

type UserStore = UserState & UserActions;

const [store, setStore] = createStore<UserStore>({
  password: null,
  mnemonic: null,
  accounts: null,
  currentAccount: null,
  status: 'uninitialized',
  initialize: (state: UserState) => {
    setStore({
      password: state.password,
      mnemonic: state.mnemonic,
      accounts: state.accounts,
      currentAccount: state.currentAccount,
      status: state.status,
    });
  },
  addAccount: (account: Account) => {
    setStore('accounts', (accounts) => [...(accounts ?? []), account]);
  },
  switchAccount: (account: Account) => {
    if (!store.accounts) {
      throw new Error("Can't switch account when there are no accounts");
    }

    const newAccount = store.accounts.find((a) => a.address === account.address);
    if (!newAccount) {
      throw new Error('Account not found');
    }

    setStore('currentAccount', newAccount);
  },
  changePassword: (password: string) => {
    setStore('password', password);
  },
  lockWallet: () => setStore('status', 'logged-out'),
  unlockWallet: () => setStore('status', 'logged-in'),
});

export { store };
