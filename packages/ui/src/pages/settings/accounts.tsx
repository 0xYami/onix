import { For, Show, type Component } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { store } from '~/lib/store';
import { storage, type Account } from '~/lib/storage';
import { truncateMiddleString } from '~/lib/utils';
import { Link } from '~/components/link';
import { ChevronLeftIcon } from '~/components/icons/chevron-left';
import { ThreeDotsIcon } from '~/components/icons/three-dots';

export const Accounts: Component = () => {
  const navigate = useNavigate();

  const switchAccount = (account: Account) => {
    if (store.currentAccount?.address === account.address) return;
    storage.setCurrentAccount(account);
    store.switchAccount(account);
    navigate('/index.html');
  };

  return (
    <div class="h-full p-4 space-y-2">
      <Link path="/settings" class="flex items-center space-x-1 mb-4">
        <ChevronLeftIcon />
        <span class="text-sm">Settings / Your accounts</span>
      </Link>
      <ul class="space-y-2">
        <For each={store.accounts}>
          {(account) => (
            <li class="-mx-2 px-2 hover:bg-zinc-700/40 rounded-lg">
              <button
                type="button"
                onClick={() => switchAccount(account)}
                class="relative w-full py-1 text-left"
              >
                <div class="flex items-center space-x-2">
                  <div class="w-10 h-10 rounded-full bg-zinc-700" />
                  <div>
                    <div>{account.name}</div>
                    <div class="text-sm text-zinc-400">
                      {truncateMiddleString(account.address, 13)}
                    </div>
                  </div>
                </div>
                <div class="absolute top-0 bottom-0 right-0 flex items-center space-x-4 z-10">
                  <Show when={store.currentAccount?.address === account.address}>
                    <div class="w-2 h-2 bg-green-700 rounded-full" />
                  </Show>
                  <Link
                    path={`/settings/accounts/view/${account.address}`}
                    class="w-6 h-6 flex-center rounded-full hover:bg-black"
                  >
                    <ThreeDotsIcon />
                  </Link>
                </div>
              </button>
            </li>
          )}
        </For>
      </ul>
      <Link
        path="/settings/accounts/create"
        class="absolute w-[90%] py-2 bottom-4 text-center border-thin border-zinc-700/80 rounded hover:bg-zinc-700/20"
      >
        + Add account
      </Link>
    </div>
  );
};
