import { createStore } from 'solid-js/store';
import type { Account } from './lib/storage';

type UserState = {
  password: string | null;
  mnemonic: string | null;
  accounts: Account[] | null;
  currentAccount: Account | null;
  isAuthenticated: boolean;
};

type UserActions = {
  initialize: (state: Omit<UserState, 'isAuthenticated'>) => void;
  addAccount: (account: Account) => void;
  switchAccount: (account: Account) => void;
  changePassword: (password: string) => void;
};

type UserStore = UserState & UserActions;

const [userStore, setUserStore] = createStore<UserStore>({
  password: null,
  mnemonic: null,
  accounts: null,
  currentAccount: null,
  isAuthenticated: false,
  initialize: (state: Omit<UserState, 'isAuthenticated'>) => {
    setUserStore({
      password: state.password,
      mnemonic: state.mnemonic,
      accounts: state.accounts,
      currentAccount: state.currentAccount,
      isAuthenticated: true,
    });
  },
  addAccount: (account: Account) => {
    setUserStore('accounts', (accounts) => [...(accounts ?? []), account]);
  },
  switchAccount: (account: Account) => {
    if (!userStore.accounts) {
      throw new Error("Can't switch account when there are no accounts");
    }

    const newAccount = userStore.accounts.find((a) => a.address === account.address);
    if (!newAccount) {
      throw new Error('Account not found');
    }

    setUserStore('currentAccount', newAccount);
  },
  changePassword: (password: string) => {
    setUserStore('password', password);
  },
});

export { userStore };
