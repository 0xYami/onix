import { createMemo, createSignal, Show, type Component } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Wallet } from 'ethers';
import { store, storeActions, type Account } from '~/store';
import { Link } from '~/components/link';
import { ChevronLeftIcon } from '~/components/icons/chevron-left';

export const CreateAccount: Component = () => {
  const derivedAccount = createMemo<Account>(() => {
    if (!store.mnemonic) {
      throw new Error("Can't create account without mnemonic");
    }
    const currentIndex = store.accounts?.length;
    if (!currentIndex) {
      throw new Error("Can't get account index");
    }
    const wallet = Wallet.fromPhrase(store.mnemonic).deriveChild(currentIndex);
    return {
      name: `Account ${currentIndex + 1}`,
      address: wallet.address,
    };
  });

  const [name, setName] = createSignal(derivedAccount().name);
  const [hasError, setHasError] = createSignal(false);
  const navigate = useNavigate();

  const createAccount = () => {
    const account: Account = {
      name: name(),
      address: derivedAccount().address,
    };
    storeActions.addAccount(account);
    storeActions.switchAccount(account);
    navigate('/index.html/settings');
  };

  return (
    <div class="h-full flex flex-col p-4 space-y-2">
      <Link path="/settings" class="flex items-center space-x-1 mb-4">
        <ChevronLeftIcon />
        <span class="text-sm">Settings / New account</span>
      </Link>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          createAccount();
        }}
        class="relative h-full space-y-4"
      >
        <label for="name" class="uppercase">
          name
        </label>
        <input
          id="name"
          type="text"
          value={name()}
          onInput={(event) => setName(event.currentTarget.value)}
          required
          autofocus
          onFocus={() => setHasError(false)}
          onBlur={() => {
            if (!/^\s*$/.test(name())) return;
            setHasError(true);
          }}
          class="w-full bg-black border-thin border-zinc-700 rounded"
        />
        <Show when={hasError()}>
          <span class="mt-2 text-xs text-red-500">
            Should be at least 1 non-whitespace character
          </span>
        </Show>
        <button
          type="submit"
          disabled={!name()}
          classList={{
            'absolute w-[100%] py-2 bottom-0 left-0 right-0 text-center border-thin border-zinc-700/80 rounded':
              true,
            'hover:bg-zinc-700/20 ': !!name(),
          }}
        >
          Save
        </button>
      </form>
    </div>
  );
};
