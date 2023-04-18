import { createMemo, createSignal, For, Show, type Component } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { store, storeActions, type Account } from '~/store';
import { truncateMiddleString } from '~/lib/utils';
import { Link } from '~/components/link';
import { CrossIcon } from '~/components/icons/cross';
import { ChevronRightIcon } from '~/components/icons/chevron-right';
import { LockIcon } from '~/components/icons/lock';
import { ShieldIcon } from '~/components/icons/shield';
import { EyeSlashIcon } from '~/components/icons/eye-slash';
import { EyeIcon } from '~/components/icons/eye';
import { SyncIcon } from '~/components/icons/sync';

export const Settings: Component = () => {
  const navigate = useNavigate();

  const switchAccount = (account: Account) => {
    if (store.currentAccount.address === account.address) return;
    storeActions.switchAccount(account);
    navigate('/index.html');
  };

  return (
    <div class="h-full p-4 space-y-2">
      <div class="flex-between">
        <span class="text-xl">Settings</span>
        <Link path="/" class="p-3 border-thin border-zinc-700 rounded hover:bg-zinc-700/30">
          <CrossIcon />
        </Link>
      </div>
      <Link
        path="/settings/change-password"
        class="flex-between -mx-2 p-2 rounded hover:bg-zinc-700/30"
      >
        <div class="flex items-center space-x-2">
          <ShieldIcon />
          <div>Change password</div>
        </div>
        <ChevronRightIcon />
      </Link>
      <button
        type="button"
        onClick={storeActions.lockWallet}
        class="flex items-center justify-start w-full p-2 -ml-2 space-x-2 rounded hover:bg-zinc-700/30"
      >
        <LockIcon />
        <div>Lock wallet</div>
      </button>
      <div class="h-[1px] bg-neutral-800" />
      <div class="flex-between py-2">
        <div class="uppercase">your accounts</div>
        <Link
          path="/settings/accounts/create"
          class="uppercase p-1.5 rounded text-sm text-zinc-500 hover:text-white hover:bg-zinc-700/30"
        >
          + Add
        </Link>
      </div>
      <ul class="space-y-4">
        <For each={store.accounts}>
          {(account) => (
            <li class="group -mx-2 hover:bg-zinc-700/30 rounded-lg p-1">
              <Link
                path={`/settings/accounts/${account.address}`}
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
                  <Show
                    when={store.currentAccount.address !== account.address}
                    fallback={<div class="w-2 h-2 bg-green-700 rounded-full" />}
                  >
                    <button
                      type="button"
                      onClick={(event) => {
                        event.preventDefault();
                        switchAccount(account);
                      }}
                      class="hidden group-hover:flex group-hover:items-center p-2 space-x-1 rounded text-sm hover:bg-black"
                    >
                      <SyncIcon />
                      <div>Switch</div>
                    </button>
                  </Show>
                  <ChevronRightIcon />
                </div>
              </Link>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
};

export const AuthStep: Component<{ onNext: () => void }> = (props) => {
  const [password, setPassword] = createSignal('');
  const [showPassword, setShowPassword] = createSignal(false);
  const [hasError, setHasError] = createSignal(false);
  const isValid = createMemo(() => store.password === password());
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        props.onNext();
      }}
      class="relative flex flex-col h-full space-y-4"
    >
      <label for="confirm-password" class="uppercase mb-3">
        confirm password
      </label>
      <div class="relative flex items-center">
        <input
          id="confirm-password"
          type={showPassword() ? 'text' : 'password'}
          value={password()}
          onInput={(event) => setPassword(event.currentTarget.value)}
          required
          autofocus
          onFocus={() => setHasError(false)}
          onBlur={() => {
            if (isValid()) return;
            setHasError(true);
          }}
          pattern={store.password}
          title="Doesn't match current password"
          placeholder="Password"
          class="w-full bg-black border-thin border-zinc-700 rounded"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          class="absolute right-2 z-10"
        >
          {showPassword() ? <EyeSlashIcon /> : <EyeIcon />}
        </button>
      </div>
      <Show when={hasError()}>
        <span class="mt-2 text-xs text-red-500">Doesn't match current password</span>
      </Show>
      <button
        type="submit"
        class="absolute w-[100%] py-2 bottom-0 text-center border-thin border-zinc-700/80 hover:bg-zinc-700/20 rounded"
      >
        Next
      </button>
    </form>
  );
};
