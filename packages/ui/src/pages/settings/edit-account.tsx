import { createSignal, Show, type Component } from 'solid-js';
import { useLocation, useNavigate } from '@solidjs/router';
import { store, storeActions } from '~/store';
import { Link } from '~/components/link';
import { ChevronLeftIcon } from '~/components/icons/chevron-left';

export const EditAccount: Component = () => {
  const [name, setName] = createSignal('');
  const [hasError, setHasError] = createSignal(false);
  const navigate = useNavigate();
  const location = useLocation<{ from: string }>();

  const account = store.accounts.find(
    (account) => account.name.toLowerCase() === location.state?.from?.toLowerCase(),
  );

  const editAccount = () => {
    if (!account) return;
    storeActions.editAccount(account.address, { ...account, name: name() });
    navigate(`/index.html/settings/accounts/${account.address}`);
  };

  return (
    <div class="h-full flex flex-col p-4 space-y-2">
      <Link
        path={`/settings/accounts/${account?.address}`}
        class="flex items-center space-x-2 mb-4"
      >
        <ChevronLeftIcon />
        <img
          src={`https://avatar.vercel.sh/${account?.address}.svg`}
          alt={`Avatar ${account?.name}`}
          class="w-6 h-6 rounded-full"
        />
        <div class="text-sm">{account?.name} / Edit name</div>
      </Link>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          editAccount();
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
          placeholder={location.state?.from}
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
