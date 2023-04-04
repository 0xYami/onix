import type { Component } from 'solid-js';
import { userStore } from '../store';
import { copyToClipboard, truncateMiddle } from '../lib/utils';
import { GasPumpIcon } from './icons/gas-pump';
import { CopyIcon } from './icons/copy';

export const Header: Component = () => {
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
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        <button type="button" onClick={() => copyToClipboard(userStore.address!)}>
          <CopyIcon class="w-[14px] h-[14px]" />
        </button>
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        <span>{truncateMiddle(userStore.address!, 11)}</span>
      </div>
    </header>
  );
};
