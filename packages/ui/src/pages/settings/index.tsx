import { type Component } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { userStore } from '../../store';
import { truncateMiddle } from '../../lib/utils';
import { CrossIcon } from '../../components/icons/cross';
import { ChevronRightIcon } from '../../components/icons/chevron-right';
import { LockIcon } from '../../components/icons/lock';
import { KeyIcon } from '../../components/icons/key';
import { ShieldIcon } from '../../components/icons/shield';
import { Link } from '../../components/link';

export const Settings: Component = () => {
  const navigate = useNavigate();
  const { currentAccount } = userStore;
  return (
    <div class="flex flex-col w-[360px] h-[540px] space-y-2 text-white bg-black border-[0.3px] border-zinc-700">
      <div class="flex items-center justify-between px-5 pt-5">
        <span class="text-xl">Settings</span>
        <button
          type="button"
          class="p-3 border-[0.3px] border-zinc-700 rounded hover:bg-zinc-700/40"
          onClick={() => {
            navigate('/index.html');
          }}
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
      <Link
        path="/settings/change-password"
        class="flex items-center justify-between mx-3 px-2 py-3 rounded hover:bg-zinc-700/30"
      >
        <div class="flex items-center space-x-2">
          <LockIcon />
          <span>Change password</span>
        </div>
        <ChevronRightIcon />
      </Link>
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
  );
};
