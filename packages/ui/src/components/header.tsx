import { createEffect, createSignal, For, Show, type Component } from 'solid-js';
import { Wallet } from 'ethers';
import { userStore } from '../store';
import { storage, type Account } from '../lib/storage';
import { copyToClipboard, truncateMiddle } from '../lib/utils';
import { GasPumpIcon } from './icons/gas-pump';
import { CopyIcon } from './icons/copy';
import { CheckIcon } from './icons/check';

export const Header: Component = () => {
  const { currentAccount } = userStore;
  const [showDropdown, setShowDropdown] = createSignal(true);
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
    <header class="relative h-[48px] flex items-center px-4 space-x-2 border-b-[0.3px] border-zinc-700 text-xs">
      <div class="flex items-center space-x-1">
        <div class="w-[7px] h-[7px] rounded-full bg-green-600" />
        <span class="font-bold uppercase">mainnet</span>
      </div>
      <div class="flex items-center space-x-1">
        <GasPumpIcon class="w-[14px] h-[14px]" />
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
            <CopyIcon class="w-[14px] h-[14px]" />
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            <span>{truncateMiddle(currentAccount!.address, 11)}</span>
          </button>
        </Show>
        <div class="relative">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown())}
            class="w-6 h-6 rounded-full bg-zinc-700"
          />
          <Show when={showDropdown()}>
            <div class="absolute w-44 h-56 flex flex-col justify-around top-8 right-0 z-10 bg-black border-[0.3px] border-zinc-700 rounded">
              <div class="w-full px-4 py-3 border-b-[0.3px] border-b-zinc-700 text-[18px]">
                Accounts
              </div>
              <ul class="grow overflow-y-scroll">
                <For each={userStore.accounts}>
                  {(account) => (
                    <li>
                      <button
                        type="button"
                        onClick={() => switchAccount(account)}
                        class="w-full px-4 py-2 space-y-1 text-start hover:bg-zinc-700/40"
                      >
                        <div class="text-[15px]">{account.name}</div>
                        <div class="text-zinc-400">{truncateMiddle(account.address, 15)}</div>
                      </button>
                    </li>
                  )}
                </For>
              </ul>
              <button
                type="button"
                onClick={createAccount}
                class="py-2 text-[15px] text-zinc-400 hover:text-white duration-200 border-t-[0.3px] border-t-zinc-700"
              >
                Create account
              </button>
            </div>
          </Show>
        </div>
      </div>
    </header>
  );
};
