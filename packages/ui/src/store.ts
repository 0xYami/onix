import { createStore } from 'solid-js/store';

type UserState = {
  password: string | null;
  mnemonic: string | null;
  address: string | null;
  isAuthenticated: boolean;
};

type UserAction = {
  initialize: (state: Omit<UserState, 'isAuthenticated'>) => void;
};

type UserStore = UserState & UserAction;

const [userStore, setUserStore] = createStore<UserStore>({
  password: null,
  mnemonic: null,
  address: null,
  isAuthenticated: false,
  initialize: (state: Omit<UserState, 'isAuthenticated'>) => {
    setUserStore({
      password: state.password,
      mnemonic: state.mnemonic,
      address: state.address,
      isAuthenticated: true,
    });
  },
});

export { userStore };
