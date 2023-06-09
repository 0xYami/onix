import { createSignal, Show, type Component } from 'solid-js';
import { store, storeActions } from '~/store';
import { EyeIcon } from '~/components/icons/eye';
import { EyeSlashIcon } from '~/components/icons/eye-slash';

export const Login: Component = () => {
  const [password, setPassword] = createSignal('');
  const [showPassword, setShowPassword] = createSignal(false);
  const [isWrong, setIsWrong] = createSignal(false);
  return (
    <div class="h-full flex-center flex-col px-4 space-y-10">
      <div class="flex flex-col items-center w-full">
        <div class="text-7xl font-bold">Onix</div>
        <div class="w-[70%] text-xs uppercase text-right text-zinc-400">where only you own it</div>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (store.password !== password()) {
            setIsWrong(true);
            return;
          }
          storeActions.unlockWallet();
        }}
        class="w-full space-y-3"
      >
        <div class="relative flex items-center">
          <input
            type={showPassword() ? 'text' : 'password'}
            value={password()}
            onInput={(event) => setPassword(event.currentTarget.value)}
            onFocus={() => setIsWrong(false)}
            onBlur={() => setIsWrong(false)}
            required
            autofocus
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
        <Show when={isWrong()}>
          <span class="mt-2 text-xs text-red-500">Wrong password</span>
        </Show>
        <button
          type="submit"
          class="w-[100%] py-2 bottom-0 text-center border-thin border-zinc-700/80 hover:bg-zinc-700/20 rounded"
        >
          Unlock
        </button>
      </form>
    </div>
  );
};
