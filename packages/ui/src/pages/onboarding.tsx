import { createSignal, Match, Switch, type Component } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { Wallet } from 'ethers';
import { Link } from '../components/link';
import { ChevronLeftIcon } from '../components/icons/chevron-left';
import { PuzzlePieceIcon } from '../components/icons/puzzle-piece';
import { ThumbstackIcon } from '../components/icons/thumbstack';
import { EyeIcon } from '../components/icons/eye';
import { EyeSlashIcon } from '../components/icons/eye-slash';
import { CopyIcon } from '../components/icons/copy';
import { copyToClipboard } from '../lib/utils';

type StepName = 'password' | 'mnemonic' | 'success';

export const Onboarding: Component = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = createSignal<StepName>('password');
  return (
    <Switch>
      <Match when={currentStep() === 'password'}>
        <PasswordStep
          onNext={() => setCurrentStep(() => 'mnemonic')}
          onPrevious={() => {
            navigate('/index.html');
          }}
        />
      </Match>
      <Match when={currentStep() === 'mnemonic'}>
        <MnemonicStep
          onNext={() => setCurrentStep(() => 'success')}
          onPrevious={() => setCurrentStep(() => 'password')}
        />
      </Match>
      <Match when={currentStep() === 'success'}>
        <SuccessStep />
      </Match>
    </Switch>
  );
};

type StepProps = {
  onNext: () => void;
  onPrevious: () => void;
};

const PasswordStep: Component<StepProps> = (props) => {
  const [password, setPassword] = createSignal('');
  const [confirmedPassword, setConfirmedPassword] = createSignal('');
  const [showPassword, setShowPassword] = createSignal(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = createSignal(false);

  return (
    <div class="relative h-[520px] p-3">
      <div class="flex items-center justify-between">
        <button type="button" class="flex items-center py-4 space-x-2" onClick={props.onPrevious}>
          <ChevronLeftIcon />
          <span>back</span>
        </button>
        <span class="text-sm">1/2</span>
      </div>
      <div class="text-xl font-bold mb-2">Set your password</div>
      <p class="text-sm text-zinc-400">
        You will use this password to unlock your wallet extension.
      </p>
      <form
        class="mt-3"
        onSubmit={(event) => {
          event.preventDefault();
          props.onNext();
        }}
      >
        <div class="flex flex-col mb-4 space-y-2">
          <label for="password" class="uppercase">
            enter password
          </label>
          <div class="relative flex items-center">
            <input
              id="password"
              type={showPassword() ? 'text' : 'password'}
              value={password()}
              onInput={(event) => setPassword(event.target.value)}
              required
              pattern=".{8,}"
              title="Password must be at least 8 characters long"
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
        </div>
        <div class="flex flex-col space-y-2">
          <label for="confirm-password" class="uppercase text-sm">
            Confirm password
          </label>
          <div class="relative flex items-center">
            <input
              id="confirm-password"
              type={showConfirmedPassword() ? 'text' : 'password'}
              value={confirmedPassword()}
              onInput={(event) => setConfirmedPassword(event.target.value)}
              required
              pattern={password()}
              title="Passwords do not match"
              placeholder="Password"
              class="w-full bg-black border-[0.3px] border-zinc-700 rounded"
            />
            <button
              type="button"
              onClick={() => setShowConfirmedPassword((prev) => !prev)}
              class="absolute right-2 z-10"
            >
              {showConfirmedPassword() ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          class="absolute w-[90%] py-2 text-center bottom-0 border-[0.3px] border-zinc-700/80 rounded"
        >
          Next
        </button>
      </form>
    </div>
  );
};

const MnemonicStep: Component<StepProps> = (props) => {
  const wallet = Wallet.createRandom();
  return (
    <div class="relative h-[520px] p-3">
      <div class="flex items-center justify-between">
        <button type="button" class="flex items-center py-4 space-x-2" onClick={props.onPrevious}>
          <ChevronLeftIcon />
          <span>back</span>
        </button>
        <span class="text-sm">2/2</span>
      </div>
      <div class="text-xl font-bold mb-2">Save your recovery phrase</div>
      <p class="text-xs text-zinc-400">
        You will use this to recover your account in case you lose your device or password.{' '}
        <span class="font-bold">Never share it with anyone!</span>
      </p>
      <div class="flex items-center justify-between my-4">
        <div class="uppercase">recovery phrase</div>
        <button
          type="button"
          class="flex items-center space-x-2"
          onClick={() => copyToClipboard(wallet.mnemonic!.phrase)}
        >
          <span class="text-sm uppercase">copy</span>
          <CopyIcon class="w-[12px] h-[12px]" />
        </button>
      </div>
      <p class="p-2 text-sm border-[0.3px] border-zinc-700/80 rounded">{wallet.mnemonic?.phrase}</p>
      <button
        type="button"
        class="absolute w-[90%] py-2 text-center bottom-0 border-[0.3px] border-zinc-700/80 rounded"
        onClick={props.onNext}
      >
        I saved it
      </button>
    </div>
  );
};

const SuccessStep: Component = () => (
  <div class="relative h-[520px] flex flex-col items-center justify-center p-3">
    <div class="w-[87%] uppercase">all set!</div>
    <div class="text-5xl text-end">Your wallet is ready</div>
    <div class="mt-24 p-4 flex flex-col space-y-3 bg-gray-800/40 border-[0.3px] border-zinc-700/80 rounded">
      <div>Pin the Onix extension for easier access</div>
      <div class="flex items-center space-x-2">
        <span class="h-[36px] w-[85%] bg-zinc-800 rounded-r-full" />
        <PuzzlePieceIcon class="w-[36px] h-[36px] p-2 border-[0.3px] border-zinc-700 rounded-full" />
      </div>
      <div class="h-[36px] flex items-center justify-between px-2 space-x-2 bg-zinc-800">
        <span>Onix</span>
        <ThumbstackIcon class="w-[30px] h-[30px] p-2 rounded-full" />
      </div>
    </div>
    <Link
      path="/home"
      class="absolute w-[90%] py-2 text-center bottom-0 border-[0.3px] border-zinc-700/80 rounded"
    >
      Finish
    </Link>
  </div>
);
