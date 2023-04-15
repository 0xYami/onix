import { createMemo, createSignal, Show, type Component } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Wallet } from 'ethers';
import { store } from '~/lib/store';
import { storage, type Account } from '~/lib/storage';
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
    storage.addUserAccount(account);
    store.addAccount(account);
    // switch account
    storage.setCurrentAccount(account);
    store.switchAccount(account);
    navigate('/index.html');
  };

  return (
    <div class="flex flex-col w-[360px] h-[540px] p-4 space-y-2 text-white bg-black border-[0.3px] border-zinc-700">
      <Link path="/settings/accounts" class="flex items-center space-x-1 mb-4">
        <ChevronLeftIcon />
        <span class="text-sm">Settings / Create account</span>
      </Link>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          createAccount();
        }}
        class="relative h-full flex flex-col mb-4"
      >
        <label for="name" class="mb-3">
          Account name
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
          class="w-full bg-black border-[0.3px] border-zinc-700 rounded"
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
            'absolute w-[100%] py-2 bottom-0 text-center border-[0.3px] border-zinc-700/80 rounded':
              true,
            'hover:bg-zinc-700/20 ': !!name(),
          }}
        >
          + Add account
        </button>
      </form>
    </div>
  );
};