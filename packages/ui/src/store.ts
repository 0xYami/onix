import { createStore } from 'solid-js/store';

type UserState = {
  password: string | null;
  mnemonic: string | null;
  isAuthenticated: boolean;
};

type UserAction = {
  initialize: (state: Pick<UserState, 'password' | 'mnemonic'>) => void;
};

type UserStore = UserState & UserAction;

const [userStore, setUserStore] = createStore<UserStore>({
  password: null,
  mnemonic: null,
  isAuthenticated: false,
  initialize: (state: Pick<UserState, 'password' | 'mnemonic'>) => {
    setUserStore({
      password: state.password,
      mnemonic: state.mnemonic,
      isAuthenticated: true,
    });
  },
});

export { userStore };
