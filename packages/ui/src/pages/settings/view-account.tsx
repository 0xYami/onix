import { type Component } from 'solid-js';
import { useLocation } from '@solidjs/router';
import { store } from '~/store';
import { truncateMiddleString } from '~/lib/utils';
import { Link } from '~/components/link';
import { ChevronLeftIcon } from '~/components/icons/chevron-left';
import { ChevronRightIcon } from '~/components/icons/chevron-right';
import { PenIcon } from '~/components/icons/pen';
import { KeyIcon } from '~/components/icons/key';
import { ShieldIcon } from '~/components/icons/shield';
import { BinIcon } from '~/components/icons/bin';

export const ViewAccount: Component = () => {
  const location = useLocation();
  const address = location.pathname.split('/').pop();
  const account = store.accounts.find(
    (account) => account.address.toLowerCase() === address?.toLowerCase(),
  );
  return (
    <div class="h-full space-y-2">
      <Link path="/settings" class="flex items-center px-4 pt-4 space-x-1">
        <ChevronLeftIcon />
        <span class="text-sm">Settings</span>
      </Link>
      <div class="mx-3 p-2">
        <div>{account?.name}</div>
        <span class="text-sm text-neutral-500">
          {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
          {truncateMiddleString(account!.address, 15)}
        </span>
      </div>
      <div class="h-[1px] bg-neutral-800 mx-5" />
      <Link
        path="/settings/accounts/edit"
        state={{ from: account?.name }}
        class="flex-between mx-3 p-2 rounded hover:bg-zinc-700/30"
      >
        <div class="flex items-center space-x-2">
          <PenIcon />
          <span>Edit name</span>
        </div>
        <ChevronRightIcon />
      </Link>
      <Link
        path="/settings/reveal-private-key"
        state={{ from: account?.name }}
        class="flex-between mx-3 p-2 rounded hover:bg-zinc-700/30"
      >
        <div class="flex items-center space-x-2">
          <KeyIcon />
          <span>Export private key</span>
        </div>
        <ChevronRightIcon />
      </Link>
      <Link
        path="/settings/reveal-mnemonic"
        state={{ from: account?.name }}
        class="flex-between mx-3 p-2 rounded hover:bg-zinc-700/30"
      >
        <div class="flex items-center space-x-2">
          <ShieldIcon />
          <span>Reveal recovery phrase</span>
        </div>
        <ChevronRightIcon />
      </Link>
      <Link
        path="/settings/accounts/remove"
        state={{ from: account?.name }}
        class="flex-between  mx-3 p-2 rounded hover:bg-zinc-700/30"
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
