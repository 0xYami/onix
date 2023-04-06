import { createStore } from 'solid-js/store';
import type { Account } from './lib/storage';

type UserState = {
  password: string | null;
  mnemonic: string | null;
  accounts: Account[] | null;
  currentAccount: Account | null;
  isAuthenticated: boolean;
};

type UserAction = {
  initialize: (state: Omit<UserState, 'isAuthenticated'>) => void;
};

type UserStore = UserState & UserAction;

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
});

export { userStore };
