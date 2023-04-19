import { createMemo, createSignal, Match, Switch, type Component } from 'solid-js';
import { useLocation } from '@solidjs/router';
import { Wallet } from 'ethers';
import { store } from '~/store';
import { Link } from '~/components/link';
import { Copy } from '~/components/copy';
import { ChevronLeftIcon } from '~/components/icons/chevron-left';
import { EyeIcon } from '~/components/icons/eye';
import { EyeSlashIcon } from '~/components/icons/eye-slash';
import { AuthStep } from './index';

type RevealProps = {
  operation: 'private-key' | 'mnemonic';
};

export const Reveal: Component<RevealProps> = (props) => {
  const location = useLocation<{ from: string }>();
  const [currentStep, setCurrentStep] = createSignal<'authenticate' | 'reveal'>('authenticate');
  const account = store.accounts.find((account) => account.name === location.state?.from);
  return (
    <div class="h-full flex flex-col p-4 space-y-2">
      <Link path="/settings" class="flex items-center space-x-2 mb-4">
        <ChevronLeftIcon />
        <img
          src={`https://avatar.vercel.sh/${account?.address}.svg`}
          alt={`Avatar ${account?.name}`}
          class="w-6 h-6 rounded-full"
        />
        <span class="text-sm capitalize">
          {account?.name} /{' '}
          {props.operation === 'private-key' ? 'Reveal private key' : 'Reveal recovery phrase'}
        </span>
      </Link>
      <Switch>
        <Match when={currentStep() === 'authenticate'}>
          <AuthStep onNext={() => setCurrentStep(() => 'reveal')} />
        </Match>
        <Match when={currentStep() === 'reveal'}>
          {props.operation === 'private-key' ? (
            <RevealPrivateKey mnemonic={store.mnemonic} />
          ) : (
            <RevealMnemonic mnemonic={store.mnemonic} />
          )}
        </Match>
      </Switch>
    </div>
  );
};

const RevealPrivateKey: Component<{ mnemonic: string }> = (props) => {
  const [blurredOut, setBlurredOut] = createSignal(true);
  const wallet = createMemo(() => Wallet.fromPhrase(props.mnemonic));
  return (
    <div class="relative h-full space-y-4">
      <div class="flex-between">
        <div class="uppercase">private key</div>
        <Copy value={wallet().privateKey} />
      </div>
      <div class="flex items-center justify-around p-2 border-thin border-zinc-700/80 rounded">
        <p
          classList={{
            'w-[92%] text-sm select-none break-words line-clamp-3': true,
            blur: blurredOut(),
          }}
        >
          {wallet().privateKey}
        </p>
        <button type="button" onClick={() => setBlurredOut((prev) => !prev)}>
          {blurredOut() ? <EyeIcon /> : <EyeSlashIcon />}
        </button>
      </div>
      <p class="text-sm text-zinc-400">
        <span class="font-bold">Never share it to anyone!</span> Your private key give you full
        control on your wallet. If you lose your private key, you will lose access to your funds and
        assets.
      </p>
      <Link
        path="/"
        class="absolute w-full py-2 bottom-0 text-center border-thin border-zinc-700/80 cursor-pointer hover:bg-zinc-700/20 rounded"
      >
        Close
      </Link>
    </div>
  );
};

const RevealMnemonic: Component<{ mnemonic: string }> = (props) => {
  const [blurredOut, setBlurredOut] = createSignal(true);
  return (
    <div class="relative h-full space-y-4">
      <div class="flex-between">
        <div class="uppercase">Recovery phrase</div>
        <Copy value={props.mnemonic} />
      </div>
      <div class="flex items-center justify-around p-2 border-thin border-zinc-700/80 rounded">
        <p
          classList={{
            'w-[92%] text-sm select-none break-words line-clamp-3': true,
            blur: blurredOut(),
          }}
        >
          {props.mnemonic}
        </p>
        <button type="button" onClick={() => setBlurredOut((prev) => !prev)}>
          {blurredOut() ? <EyeIcon /> : <EyeSlashIcon />}
        </button>
      </div>
      <p class="text-sm text-zinc-400">
        <span class="font-bold">Never share it to anyone!</span> Your recovery phrase give you full
        control on your wallet. If you lose your recovery phrase, you will lose access to your funds
        and assets.
      </p>
      <Link
        path="/"
        class="absolute w-full py-2 bottom-0 text-center border-thin border-zinc-700/80 cursor-pointer hover:bg-zinc-700/20 rounded"
      >
        Close
      </Link>
    </div>
  );
};
