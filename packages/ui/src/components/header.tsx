import { createEffect, createSignal, Show, type Component } from 'solid-js';
import { Portal } from 'solid-js/web';
import { Wallet } from 'ethers';
import { userStore } from '../store';
import { storage, type Account } from '../lib/storage';
import { copyToClipboard, truncateMiddle } from '../lib/utils';
import { GasPumpIcon } from './icons/gas-pump';
import { CopyIcon } from './icons/copy';
import { CheckIcon } from './icons/check';
import { CrossIcon } from './icons/cross';
import { ChevronRightIcon } from './icons/chevron-right';
import { LockIcon } from './icons/lock';
import { KeyIcon } from './icons/key';
import { ShieldIcon } from './icons/shield';

export const Header: Component = () => {
  const { currentAccount } = userStore;
  const [showSettings, setShowSettings] = createSignal(true);
  const [copying, setCopying] = createSignal(false);

  createEffect(() => {
    if (!copying()) return;
    setTimeout(() => {
      setCopying(false);
    }, 2000);
  });

  const createAccount = () => {
    if (!userStore.mnemonic) {
      throw new Error("Can't create account without mnemonic");
    }

    const currentIndex = userStore.accounts?.length;
    if (!currentIndex) {
      throw new Error("Can't get account index");
    }

    const wallet = Wallet.fromPhrase(userStore.mnemonic);
    const newWallet = wallet.deriveChild(currentIndex);
    const newAccount: Account = {
      name: `Account ${currentIndex + 1}`,
      address: newWallet.address,
    };
    storage.addUserAccount(newAccount);
    userStore.addAccount(newAccount);
    switchAccount(newAccount);
  };

  const switchAccount = (account: Account) => {
    storage.setCurrentAccount(account);
    userStore.switchAccount(account);
  };

  const copyAddress = () => {
    if (!currentAccount?.address) return;
    setCopying(true);
    copyToClipboard(currentAccount.address);
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
        <Show
          when={!copying()}
          fallback={
            <div class="flex items-center space-x-2 text-green-600">
              <CheckIcon />
              <span>Copied</span>
            </div>
          }
        >
          <button
            type="button"
            onClick={copyAddress}
            class="flex items-center space-x-2 text-zinc-400/90 hover:text-white duration-200"
          >
            <CopyIcon class="w-3 h-3" />
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            <span>{truncateMiddle(currentAccount!.address, 11)}</span>
          </button>
        </Show>
        <button
          type="button"
          onClick={() => setShowSettings(true)}
          class="w-6 h-6 rounded-full bg-zinc-700"
        />
      </div>
      <Show when={showSettings()}>
        <Portal>
          <div class="absolute flex items-center justify-center inset-0">
            <div class="flex flex-col w-[360px] h-[540px] space-y-2 border-[0.3px] border-zinc-700 text-white bg-black z-50">
              <div class="flex items-center justify-between px-5 pt-5">
                <span class="text-xl">Settings</span>
                <button
                  type="button"
                  class="p-3 border-[0.3px] border-zinc-700 rounded hover:bg-zinc-700/40"
                  onClick={() => setShowSettings(false)}
                >
                  <CrossIcon />
                </button>
              </div>
              <button
                type="button"
                class="flex items-center justify-between mx-3 p-2 rounded hover:bg-zinc-700/30"
              >
                <div>
                  <div>{currentAccount?.name}</div>
                  <span class="text-sm text-neutral-500">
                    {truncateMiddle(currentAccount!.address, 11)}
                  </span>
                </div>
                <ChevronRightIcon />
              </button>
              <div class="h-[1px] bg-neutral-800 mx-5" />
              <button
                type="button"
                class="flex items-center justify-between mx-3 px-2 py-3 rounded hover:bg-zinc-700/30"
              >
                <div class="flex items-center space-x-2">
                  <LockIcon />
                  <span>Change password</span>
                </div>
                <ChevronRightIcon />
              </button>
              <button
                type="button"
                class="flex items-center justify-between mx-3 px-2 py-3 rounded hover:bg-zinc-700/30"
              >
                <div class="flex items-center space-x-2">
                  <KeyIcon />
                  <span>Export private key</span>
                </div>
                <ChevronRightIcon />
              </button>
              <button
                type="button"
                class="flex items-center justify-between mx-3 px-2 py-3 rounded hover:bg-zinc-700/30"
              >
                <div class="flex items-center space-x-2">
                  <ShieldIcon />
                  <span>Reveal recovery phrase</span>
                </div>
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </Portal>
      </Show>
    </header>
  );
};
