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
  editAccount: (address: string, newAccount: Account) => void;
  removeAccount: (account: Account) => void;
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
  editAccount: (address: string, account: Account) => {
    if (store.currentAccount?.address.toLowerCase() === address.toLowerCase()) {
      setStore('currentAccount', account);
    }
    setStore('accounts', (accounts) => {
      if (!accounts) return [];
      return accounts.map((acc) => {
        if (acc.address.toLowerCase() !== address.toLowerCase()) return acc;
        return account;
      });
    });
  },
  removeAccount: (account: Account) => {
    if (!store.accounts || store.accounts.length === 0) {
      throw new Error('[store] tried to remove account while no account exists');
    }
    const accounts = store.accounts.filter((acc) => acc.address !== account.address);
    if (accounts.length === 0) {
      throw new Error('[store] tried to remove the last account');
    }
    setStore('accounts', accounts);
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
