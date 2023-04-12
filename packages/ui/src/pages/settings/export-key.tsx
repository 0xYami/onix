import { createSignal, Match, Switch, type Component } from 'solid-js';
import { Wallet } from 'ethers';
import { AuthStep } from './index';
import { userStore } from '../../store';
import { copyToClipboard } from '../../lib/utils';
import { Link } from '../../components/link';
import { ChevronLeftIcon } from '../../components/icons/chevron-left';
import { CopyIcon } from '../../components/icons/copy';
import { EyeIcon } from '../../components/icons/eye';
import { EyeSlashIcon } from '../../components/icons/eye-slash';

export const ExportKey: Component = () => {
  const [currentStep, setCurrentStep] = createSignal<'authenticate' | 'reveal'>('authenticate');
  return (
    <div class="flex flex-col w-[360px] h-[540px] p-4 space-y-2 text-white bg-black border-[0.3px] border-zinc-700">
      <Link path="/settings" class="flex items-center space-x-1 mb-4">
        <ChevronLeftIcon />
        <span>Settings / Export private key</span>
      </Link>
      <Switch>
        <Match when={currentStep() === 'authenticate'}>
          <AuthStep onNext={() => setCurrentStep(() => 'reveal')} />
        </Match>
        <Match when={currentStep() === 'reveal'}>
          <RevealKeyStep />
        </Match>
      </Switch>
    </div>
  );
};

const RevealKeyStep: Component = () => {
  const [blurredOut, setBlurredOut] = createSignal(true);
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const wallet = Wallet.fromPhrase(userStore.mnemonic!);
  return (
    <div class="relative h-full space-y-4">
      <div class="flex items-center justify-between">
        <div class="uppercase">private key</div>
        <button
          type="button"
          class="flex items-center space-x-2"
          onClick={() => copyToClipboard(wallet.privateKey)}
        >
          <span class="text-xs uppercase">copy</span>
          <CopyIcon class="w-[12px] h-[12px]" />
        </button>
      </div>
      <div class="flex items-center justify-around p-2 border-[0.3px] border-zinc-700/80 rounded">
        <p
          class="w-[92%] text-sm select-none break-words line-clamp-3"
          classList={{ blur: blurredOut() }}
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
