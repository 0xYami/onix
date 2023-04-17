import { createSignal, Match, Switch, type Component } from 'solid-js';
import { useLocation, useNavigate } from '@solidjs/router';
import { store, storeActions, type Account } from '~/store';
import { truncateMiddleString } from '~/lib/utils';
import { Link } from '~/components/link';
import { ChevronLeftIcon } from '~/components/icons/chevron-left';
import { AuthStep } from './index';

export const RemoveAccount: Component = () => {
  const [currentStep, setCurrentStep] = createSignal<'authenticate' | 'confirm'>('authenticate');
  const location = useLocation<{ from: string }>();
  const account = store.accounts?.find((account) => account.name === location.state?.from);
  return (
    <div class="h-full flex flex-col p-4 space-y-2">
      <Link path="/settings" class="flex items-center space-x-1 mb-4">
        <ChevronLeftIcon />
        <span class="text-sm">{location.state?.from} / Remove account</span>
      </Link>
      <Switch>
        <Match when={currentStep() === 'authenticate'}>
          <AuthStep onNext={() => setCurrentStep(() => 'confirm')} />
        </Match>
        <Match when={currentStep() === 'confirm'}>
          {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
          <ConfirmStep account={account!} />
        </Match>
      </Switch>
    </div>
  );
};

const ConfirmStep: Component<{ account: Account }> = (props) => {
  const navigate = useNavigate();
  const [confirmed, setConfirmed] = createSignal(false);

  const removeAccount = () => {
    storeActions.removeAccount(props.account);

    // FIX: switch to very first account, this assumes it gets never removed
    if (!store.accounts) return;
    const account = store.accounts[0];
    storeActions.switchAccount(account);

    navigate('/index.html');
  };

  return (
    <div class="relative h-full space-y-5">
      <div>Are you sure you want to remove this account?</div>
      <div class="flex items-center -mx-1 p-1 space-x-2 bg-zinc-700/40 rounded">
        <div class="w-10 h-10 rounded-full bg-zinc-700" />
        <div>
          <div>{props.account.name}</div>
          <div class="text-sm text-zinc-400">{truncateMiddleString(props.account.address, 13)}</div>
        </div>
      </div>
      <p class="text-sm text-zinc-400">
        Once removed, you will still be able to recover your account using your recovery phrase.
      </p>
      <div class="absolute w-[100%] bottom-0 space-y-4">
        <div
          classList={{
            'flex-between p-4 space-x-3 border-thin rounded hover:bg-zinc-700/20': true,
            'border-zinc-700/80': !confirmed(),
            'border-teal-800': confirmed(),
          }}
        >
          <p class="text-sm">
            I understand that I won’t be able to recover my wallet and funds if I loose my recovery
            phrase
          </p>
          <input
            type="checkbox"
            checked={confirmed()}
            onChange={() => setConfirmed(!confirmed())}
            classList={{
              'w-6 h-6 cursor-pointer border-thin border-zinc-700/80 rounded-full bg-black': true,
              'checked:border-thin checked:border-teal-500 checked:text-black checked:hover:border-teal-500':
                true,
              'focus:ring-thin focus:ring-zinc-700/80 checked:focus:ring-teal-500 focus:ring-offset-0':
                true,
            }}
          />
        </div>
        <button
          type="button"
          disabled={!confirmed()}
          onClick={removeAccount}
          classList={{
            'w-[100%] py-2 text-center text-red-600 border-thin border-zinc-700/80 rounded': true,
            'border-red-600 hover:bg-zinc-700/20': confirmed(),
            'disabled:text-zinc-700': true,
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
};
