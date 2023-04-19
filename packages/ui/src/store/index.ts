import { z, networkName, type NetworkName } from '@onix/schemas';
import { config } from '~/lib/config';
import { createLocalStorage } from './createLocalStorage';

const account = z.object({
  name: z.string(),
  address: z.string(),
});

export type Account = z.infer<typeof account>;

const storeState = z.object({
  password: z.string().min(8),
  mnemonic: z.string(),
  currentNetwork: networkName,
  currentAccount: account,
  accounts: z.array(account),
  status: z.enum(['logged-in', 'logged-out', 'uninitialized']),
});

type StoreState = z.infer<typeof storeState>;

const initialState: StoreState = {
  password: '',
  mnemonic: '',
  currentNetwork: 'mainnet',
  currentAccount: {
    name: '',
    address: '',
  },
  accounts: [],
  status: 'uninitialized',
};

const [store, setStore] = createLocalStorage({
  storageKey: config.storageKey,
  schema: storeState,
  initialState,
});

type StoreActions = {
  initialize: (state: StoreState) => void;
  addAccount: (account: Account) => void;
  editAccount: (address: string, newAccount: Account) => void;
  removeAccount: (account: Account) => void;
  switchAccount: (account: Account) => void;
  switchNetwork: (network: NetworkName) => void;
  changePassword: (password: string) => void;
  lockWallet: () => void;
  unlockWallet: () => void;
};

const storeActions: StoreActions = {
  initialize: (state) => setStore(state),
  addAccount: (account: Account) => {
    setStore('accounts', (accounts) => [...accounts, account]);
  },
  editAccount: (address: string, account: Account) => {
    if (store.currentAccount.address.toLowerCase() === address.toLowerCase()) {
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
    if (store.accounts.length === 0) {
      throw new Error('[store] tried to remove account while no account exists');
    }
    const accounts = store.accounts.filter((acc) => acc.address !== account.address);
    if (accounts.length === 0) {
      throw new Error('[store] tried to remove the last account');
    }
    setStore('accounts', accounts);
  },
  switchAccount: (account: Account) => {
    const newAccount = store.accounts.find((a) => a.address === account.address);
    if (!newAccount) {
      throw new Error('[store] tried to switch to unknown account');
    }
    setStore('currentAccount', newAccount);
  },
  switchNetwork: (network) => setStore('currentNetwork', network),
  changePassword: (password: string) => setStore('password', password),
  lockWallet: () => setStore('status', 'logged-out'),
  unlockWallet: () => setStore('status', 'logged-in'),
};

export { store, storeActions };
