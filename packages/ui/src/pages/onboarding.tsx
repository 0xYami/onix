import { createEffect, createSignal, Match, Switch, type Component } from 'solid-js';
import { createStore } from 'solid-js/store';
import { useNavigate } from '@solidjs/router';
import { type Mnemonic, Wallet } from 'ethers';
import { ChevronLeftIcon } from '../components/icons/chevron-left';
import { PuzzlePieceIcon } from '../components/icons/puzzle-piece';
import { ThumbstackIcon } from '../components/icons/thumbstack';
import { EyeIcon } from '../components/icons/eye';
import { EyeSlashIcon } from '../components/icons/eye-slash';
import { CopyIcon } from '../components/icons/copy';
import { storage, type Account } from '../lib/storage';
import { userStore } from '../store';
import { copyToClipboard } from '../lib/utils';

type StepName = 'password' | 'mnemonic' | 'success';

type OnboardingState = {
  password: string;
  mnemonic: Mnemonic | null;
  address: string | null;
};

type OnboardingStore = OnboardingState & {
  reset: () => void;
};

const initialState: OnboardingState = {
  password: '',
  mnemonic: null,
  address: null,
};

const [store, setStore] = createStore<OnboardingStore>({
  ...initialState,
  reset: () => setStore(initialState),
});

export const Onboarding: Component = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = createSignal<StepName>('password');

  createEffect(async () => {
    if (currentStep() !== 'success') return;
    if (!store.mnemonic || !store.address) return;
    const account: Account = {
      name: 'Account 1',
      address: store.address,
    };
    storage.setUserState({
      password: store.password,
      mnemonic: store.mnemonic.phrase,
      currentAccount: account,
      accounts: [account],
    });
  });

  return (
    <Switch>
      <Match when={currentStep() === 'password'}>
        <PasswordStep
          onNext={() => setCurrentStep(() => 'mnemonic')}
          onPrevious={() => {
            store.reset();
            navigate('/index.html');
          }}
        />
      </Match>
      <Match when={currentStep() === 'mnemonic'}>
        <MnemonicStep
          onNext={() => setCurrentStep(() => 'success')}
          onPrevious={() => {
            store.reset();
            setCurrentStep(() => 'password');
          }}
        />
      </Match>
      <Match when={currentStep() === 'success'}>
        <SuccessStep
          onNext={() => {
            const state = storage.getUserState();
            if (!state) return;
            userStore.initialize(state);
          }}
        />
      </Match>
    </Switch>
  );
};

type StepProps = {
  onNext: () => void;
  onPrevious: () => void;
};

const PasswordStep: Component<StepProps> = (props) => {
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
              value={store.password}
              onInput={(event) => setStore({ password: event.target.value })}
              autofocus
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
              pattern={store.password}
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
  const [blurredOut, setBlurredOut] = createSignal(true);

  const wallet = Wallet.createRandom();
  setStore({
    mnemonic: wallet.mnemonic,
    // FIX: This is Vitalik address, we use it in dev in order to have assets to display
    address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    // address: wallet.address,
  });

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
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          onClick={() => copyToClipboard(wallet.mnemonic!.phrase)}
        >
          <span class="text-xs uppercase">copy</span>
          <CopyIcon class="w-[12px] h-[12px]" />
        </button>
      </div>
      <div class="flex items-center justify-around p-2 border-[0.3px] border-zinc-700/80 rounded">
        <p class="w-[92%] text-sm select-none" classList={{ blur: blurredOut() }}>
          {wallet.mnemonic?.phrase}
        </p>
        <button type="button" onClick={() => setBlurredOut((prev) => !prev)}>
          {blurredOut() ? <EyeIcon /> : <EyeSlashIcon />}
        </button>
      </div>
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

const SuccessStep: Component<Pick<StepProps, 'onNext'>> = (props) => (
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
    <button
      type="button"
      onClick={props.onNext}
      class="absolute w-[90%] py-2 text-center bottom-0 border-[0.3px] border-zinc-700/80 rounded"
    >
      Finish
    </button>
  </div>
);
