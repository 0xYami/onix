import { createEffect, createSignal, type Component } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Wallet } from 'ethers';
import { store } from '../lib/store';
import { storage, type Account } from '../lib/storage';
import { truncateMiddleString } from '../lib/utils';
import { GasPumpIcon } from './icons/gas-pump';
import { Copy } from './copy';
import { CopyIcon } from './icons/copy';

export const Header: Component = () => {
  const navigate = useNavigate();
  const { currentAccount } = store;
  const [copying, setCopying] = createSignal(false);

  createEffect(() => {
    if (!copying()) return;
    setTimeout(() => {
      setCopying(false);
    }, 2000);
  });

  const createAccount = () => {
    if (!store.mnemonic) {
      throw new Error("Can't create account without mnemonic");
    }

    const currentIndex = store.accounts?.length;
    if (!currentIndex) {
      throw new Error("Can't get account index");
    }

    const wallet = Wallet.fromPhrase(store.mnemonic);
    const newWallet = wallet.deriveChild(currentIndex);
    const newAccount: Account = {
      name: `Account ${currentIndex + 1}`,
      address: newWallet.address,
    };
    storage.addUserAccount(newAccount);
    store.addAccount(newAccount);
    switchAccount(newAccount);
  };

  const switchAccount = (account: Account) => {
    storage.setCurrentAccount(account);
    store.switchAccount(account);
  };

  return (
    <header class="relative h-12 flex items-center px-4 space-x-2 border-b-[0.3px] border-zinc-700 text-xs">
      <div class="flex items-center space-x-1">
        <div class="w-2 h-2 rounded-full bg-green-600" />
        <span class="font-bold uppercase">mainnet</span>
      </div>
      <div class="flex items-center space-x-1">
        <GasPumpIcon class="w-3 h-3" />
        <span>$2.01</span>
      </div>
      <div class="absolute right-0 pr-4 flex items-center space-x-2">
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        <Copy value={currentAccount!.address}>
          <>
            <CopyIcon class="w-3 h-3" />
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            <span>{truncateMiddleString(currentAccount!.address, 11)}</span>
          </>
        </Copy>
        <button
          type="button"
          onClick={() => navigate('/index.html/settings')}
          class="w-6 h-6 rounded-full bg-zinc-700"
        />
      </div>
    </header>
  );
};
