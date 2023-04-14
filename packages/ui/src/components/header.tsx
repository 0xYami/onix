import { type Component } from 'solid-js';
import { store } from '~/lib/store';
import { truncateMiddleString } from '~/lib/utils';
import { Link } from './link';
import { Copy } from './copy';
import { GasPumpIcon } from './icons/gas-pump';
import { CopyIcon } from './icons/copy';

export const Header: Component = () => {
  const { currentAccount } = store;
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
        <Link path="/settings" class="w-6 h-6 rounded-full bg-zinc-700" />
      </div>
    </header>
  );
};
