import { createEffect, createSignal, Match, Show, Switch, type Component } from 'solid-js';
import { AuthStep } from './index';
import { userStore } from '../../store';
import { copyToClipboard } from '../../lib/utils';
import { Link } from '../../components/link';
import { ChevronLeftIcon } from '../../components/icons/chevron-left';
import { CopyIcon } from '../../components/icons/copy';
import { EyeIcon } from '../../components/icons/eye';
import { EyeSlashIcon } from '../../components/icons/eye-slash';
import { CheckIcon } from '../../components/icons/check';

export const RevealMnemonic: Component = () => {
  const [currentStep, setCurrentStep] = createSignal<'authenticate' | 'reveal'>('authenticate');
  return (
    <div class="flex flex-col w-[360px] h-[540px] p-4 space-y-2 text-white bg-black border-[0.3px] border-zinc-700">
      <Link path="/settings" class="flex items-center space-x-1 mb-4">
        <ChevronLeftIcon />
        <span class="text-sm">Settings / Reveal recovery phrase</span>
      </Link>
      <Switch>
        <Match when={currentStep() === 'authenticate'}>
          <AuthStep onNext={() => setCurrentStep(() => 'reveal')} />
        </Match>
        <Match when={currentStep() === 'reveal'}>
          <RevealStep />
        </Match>
      </Switch>
    </div>
  );
};

const RevealStep: Component = () => {
  const [copying, setCopying] = createSignal(false);
  const [blurredOut, setBlurredOut] = createSignal(true);

  createEffect(() => {
    if (!copying()) return;
    setTimeout(() => {
      setCopying(false);
    }, 2000);
  });

  const copyMnemonic = () => {
    setCopying(true);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    copyToClipboard(userStore.mnemonic!);
  };

  return (
    <div class="relative h-full space-y-4">
      <div class="flex items-center justify-between">
        <div class="uppercase">Recovery phrase</div>
        <Show
          when={!copying()}
          fallback={
            <div class="flex items-center space-x-2 text-xs text-green-600">
              <span>Copied</span>
              <CheckIcon />
            </div>
          }
        >
          <button type="button" class="flex items-center space-x-2" onClick={copyMnemonic}>
            <span class="text-xs uppercase">copy</span>
            <CopyIcon class="w-3 h-3" />
          </button>
        </Show>
      </div>
      <div class="flex items-center justify-around p-2 border-[0.3px] border-zinc-700/80 rounded">
        <p
          classList={{
            'w-[92%] text-sm select-none break-words line-clamp-3': true,
            blur: blurredOut(),
          }}
        >
          {userStore.mnemonic}
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
