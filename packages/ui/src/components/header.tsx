import { createEffect, createSignal, Show, type Component } from 'solid-js';
import { userStore } from '../store';
import { copyToClipboard, truncateMiddle } from '../lib/utils';
import { GasPumpIcon } from './icons/gas-pump';
import { CopyIcon } from './icons/copy';
import { CheckIcon } from './icons/check';

export const Header: Component = () => {
  const { currentAccount } = userStore;
  const [copying, setCopying] = createSignal(false);

  createEffect(() => {
    if (!copying()) return;
    setTimeout(() => {
      setCopying(false);
    }, 2000);
  });

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
      <div class="absolute right-0 pr-4 flex items-center space-x-1">
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
      </div>
    </header>
  );
};
