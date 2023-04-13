import { createMemo, createSignal, Show, type Component } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { store } from '../../lib/store';
import { storage } from '../../lib/storage';
import { truncateMiddleString } from '../../lib/utils';
import { CrossIcon } from '../../components/icons/cross';
import { ChevronRightIcon } from '../../components/icons/chevron-right';
import { LockIcon } from '../../components/icons/lock';
import { KeyIcon } from '../../components/icons/key';
import { ShieldIcon } from '../../components/icons/shield';
import { Link } from '../../components/link';
import { EyeSlashIcon } from '../../components/icons/eye-slash';
import { EyeIcon } from '../../components/icons/eye';

export const Settings: Component = () => {
  const navigate = useNavigate();
  const { currentAccount } = store;

  const lockWallet = () => {
    storage.lockWallet();
    store.lockWallet();
  };

  return (
    <div class="relative flex flex-col w-[360px] h-[540px] space-y-2 text-white bg-black border-[0.3px] border-zinc-700">
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
        <div class="flex flex-col items-start">
          <div>{currentAccount?.name}</div>
          <span class="text-sm text-neutral-500">
            {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
            {truncateMiddleString(currentAccount!.address, 11)}
          </span>
        </div>
        <ChevronRightIcon />
      </button>
      <div class="h-[1px] bg-neutral-800 mx-5" />
      <Link
        path="/settings/change-password"
        class="flex items-center justify-between mx-3 p-2 rounded hover:bg-zinc-700/30"
      >
        <div class="flex items-center space-x-2">
          <LockIcon />
          <span>Change password</span>
        </div>
        <ChevronRightIcon />
      </Link>
      <Link
        path="/settings/export-key"
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
        class="flex items-center justify-between mx-3 p-2 rounded hover:bg-zinc-700/30"
      >
        <div class="flex items-center space-x-2">
          <ShieldIcon />
          <span>Reveal recovery phrase</span>
        </div>
        <ChevronRightIcon />
      </Link>
      <button
        type="button"
        onClick={lockWallet}
        class="absolute w-[90%] py-2 mx-auto bottom-4 left-0 right-0 border-[0.3px] border-zinc-700/80 rounded hover:bg-zinc-700/20"
      >
        Lock wallet
      </button>
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
      class="relative h-full flex flex-col mb-4"
    >
      <label for="password" class="uppercase mb-3">
        confirm password
      </label>
      <div class="relative flex items-center">
        <input
          id="password"
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
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          pattern={store.password!}
          title="Doesn't match current password"
          placeholder="Password"
          class="w-full bg-black border-[0.3px] border-zinc-700 rounded"
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
        class="absolute w-[100%] py-2 bottom-0 text-center border-[0.3px] border-zinc-700/80 cursor-pointer hover:bg-zinc-700/20 rounded"
      >
        Next
      </button>
    </form>
  );
};
