import { createSignal, Match, Switch, type Component } from 'solid-js';
import { useLocation } from '@solidjs/router';
import { Wallet } from 'ethers';
import { store } from '~/lib/store';
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
  return (
    <div class="flex flex-col w-[360px] h-[540px] p-4 space-y-2 text-white bg-black border-[0.3px] border-zinc-700">
      <Link path="/settings" class="flex items-center space-x-1 mb-4">
        <ChevronLeftIcon />
        <span class="text-sm capitalize">
          {location.state?.from || 'Settings'} /{' '}
          {props.operation === 'private-key' ? 'Reveal private key' : 'Reveal recovery phrase'}
        </span>
      </Link>
      <Switch>
        <Match when={currentStep() === 'authenticate'}>
          <AuthStep onNext={() => setCurrentStep(() => 'reveal')} />
        </Match>
        <Match when={currentStep() === 'reveal'}>
          {props.operation === 'private-key' ? (
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            <RevealPrivateKey mnemonic={store.mnemonic!} />
          ) : (
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            <RevealMnemonic mnemonic={store.mnemonic!} />
          )}
        </Match>
      </Switch>
    </div>
  );
};

const RevealPrivateKey: Component<{ mnemonic: string }> = (props) => {
  const [blurredOut, setBlurredOut] = createSignal(true);
  const wallet = Wallet.fromPhrase(props.mnemonic);
  return (
    <div class="relative h-full space-y-4">
      <div class="flex items-center justify-between">
        <div class="uppercase">private key</div>
        <Copy value={wallet.privateKey} />
      </div>
      <div class="flex items-center justify-around p-2 border-[0.3px] border-zinc-700/80 rounded">
        <p
          classList={{
            'w-[92%] text-sm select-none break-words line-clamp-3': true,
            blur: blurredOut(),
          }}
        >
          {wallet.privateKey}
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
        class="absolute w-full py-2 bottom-0 text-center border-[0.3px] border-zinc-700/80 cursor-pointer hover:bg-zinc-700/20 rounded"
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
      <div class="flex items-center justify-between">
        <div class="uppercase">Recovery phrase</div>
        <Copy value={props.mnemonic} />
      </div>
      <div class="flex items-center justify-around p-2 border-[0.3px] border-zinc-700/80 rounded">
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
        class="absolute w-full py-2 bottom-0 text-center border-[0.3px] border-zinc-700/80 cursor-pointer hover:bg-zinc-700/20 rounded"
      >
        Close
      </Link>
    </div>
  );
};
