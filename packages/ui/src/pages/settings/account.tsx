import { type Component } from 'solid-js';
import { store } from '~/lib/store';
import { truncateMiddleString } from '~/lib/utils';
import { Link } from '~/components/link';
import { ChevronLeftIcon } from '~/components/icons/chevron-left';
import { ChevronRightIcon } from '~/components/icons/chevron-right';
import { PenIcon } from '~/components/icons/pen';
import { KeyIcon } from '~/components/icons/key';
import { ShieldIcon } from '~/components/icons/shield';
import { BinIcon } from '~/components/icons/bin';

export const Account: Component = () => {
  const { currentAccount } = store;
  return (
    <div class="flex flex-col w-[360px] h-[540px] space-y-2 text-white bg-black border-[0.3px] border-zinc-700">
      <Link path="/settings/accounts" class="flex items-center px-4 pt-4 space-x-1">
        <ChevronLeftIcon />
        <span class="text-sm">Your Accounts</span>
      </Link>
      <div class="flex flex-col items-start mx-3 p-2">
        <div>{currentAccount?.name}</div>
        <span class="text-sm text-neutral-500">
          {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
          {truncateMiddleString(currentAccount!.address, 15)}
        </span>
      </div>
      <div class="h-[1px] bg-neutral-800 mx-5" />
      <Link
        path="/settings/accounts"
        class="flex items-center justify-between mx-3 p-2 rounded hover:bg-zinc-700/30"
      >
        <div class="flex items-center space-x-2">
          <PenIcon />
          <span>Edit name</span>
        </div>
        <ChevronRightIcon />
      </Link>
      <Link
        path="/settings/reveal-private-key"
        state={{ from: currentAccount?.name }}
        class="flex items-center justify-between mx-3 p-2 rounded hover:bg-zinc-700/30"
      >
        <div class="flex items-center space-x-2">
          <KeyIcon />
          <span>Export private key</span>
        </div>
        <ChevronRightIcon />
      </Link>
      <Link
        path="/settings/reveal-mnemonic"
        state={{ from: currentAccount?.name }}
        class="flex items-center justify-between mx-3 p-2 rounded hover:bg-zinc-700/30"
      >
        <div class="flex items-center space-x-2">
          <ShieldIcon />
          <span>Reveal recovery phrase</span>
        </div>
        <ChevronRightIcon />
      </Link>
      <Link
        path="/settings/remove"
        state={{ from: currentAccount?.name }}
        class="flex items-center justify-between mx-3 p-2 rounded hover:bg-zinc-700/30"
      >
        <div class="flex items-center space-x-2">
          <BinIcon />
          <span>Remove account</span>
        </div>
        <ChevronRightIcon />
      </Link>
    </div>
  );
};
