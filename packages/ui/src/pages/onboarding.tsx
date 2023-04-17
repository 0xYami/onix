import { createEffect, createMemo, createSignal, Match, Show, Switch } from 'solid-js';
import type { Component } from 'solid-js';
import { createStore } from 'solid-js/store';
import { useNavigate } from '@solidjs/router';
import { type Mnemonic, Wallet } from 'ethers';
import { storeActions, type Account } from '~/store';
import { Copy } from '~/components/copy';
import { ChevronLeftIcon } from '~/components/icons/chevron-left';
import { PuzzlePieceIcon } from '~/components/icons/puzzle-piece';
import { ThumbstackIcon } from '~/components/icons/thumbstack';
import { EyeIcon } from '~/components/icons/eye';
import { EyeSlashIcon } from '~/components/icons/eye-slash';

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

const [onboardingStore, setOnboardingStore] = createStore<OnboardingStore>({
  ...initialState,
  reset: () => setOnboardingStore(initialState),
});

type StepName = 'password' | 'mnemonic' | 'success';

export const Onboarding: Component = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = createSignal<StepName>('password');

  createEffect(async () => {
    if (currentStep() !== 'success') return;
    if (!onboardingStore.mnemonic || !onboardingStore.address) return;
    const account: Account = {
      name: 'Account 1',
      address: onboardingStore.address,
    };
    storeActions.initialize({
      password: onboardingStore.password,
      mnemonic: onboardingStore.mnemonic.phrase,
      currentAccount: account,
      accounts: [account],
      status: 'logged-in',
    });
  });

  return (
    <Switch>
      <Match when={currentStep() === 'password'}>
        <PasswordStep
          onNext={() => setCurrentStep(() => 'mnemonic')}
          onPrevious={() => {
            onboardingStore.reset();
            navigate('/index.html');
          }}
        />
      </Match>
      <Match when={currentStep() === 'mnemonic'}>
        <MnemonicStep
          onNext={() => setCurrentStep(() => 'success')}
          onPrevious={() => {
            onboardingStore.reset();
            setCurrentStep(() => 'password');
          }}
        />
      </Match>
      <Match when={currentStep() === 'success'}>
        <SuccessStep
          onNext={() => {
            // storeActions.initialize(state);
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
  const [policyAgreed, setPolicyAgreed] = createSignal(false);
  const [errors, setErrors] = createStore<{ password: boolean; confirm: boolean }>({
    password: false,
    confirm: false,
  });

  const stepIsValid = createMemo(() => {
    return (
      onboardingStore.password.length >= 8 &&
      confirmedPassword() === onboardingStore.password &&
      policyAgreed()
    );
  });

  return (
    <div class="relative h-[520px] p-3">
      <div class="flex-between">
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
        onSubmit={(event) => {
          event.preventDefault();
          props.onNext();
        }}
        class="mt-3"
      >
        <div class="relative mb-8 space-y-2">
          <label for="password" class="uppercase">
            enter password
          </label>
          <div class="relative flex items-center">
            <input
              id="password"
              type={showPassword() ? 'text' : 'password'}
              value={onboardingStore.password}
              onInput={(event) => setOnboardingStore({ password: event.target.value })}
              autofocus
              required
              pattern=".{8,}"
              title="Password must be at least 8 characters long"
              placeholder="Password"
              onFocus={() => setErrors('password', false)}
              onBlur={() => {
                const isValid = onboardingStore.password.length >= 8;
                setErrors('password', !isValid);
                // edge case when confirmed password previously matched password while not actually being valid
                // so we need to trigger the confirmed password error
                if (
                  isValid &&
                  confirmedPassword().length &&
                  onboardingStore.password !== confirmedPassword()
                ) {
                  setErrors('confirm', true);
                }
              }}
              classList={{
                'w-full bg-black border-thin rounded': true,
                'border-zinc-700': !errors.password,
                'border-red-500': errors.password,
              }}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              class="absolute right-2 z-10"
            >
              {showPassword() ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
          <Show when={errors.password}>
            <span class="absolute mt-2 text-xs text-red-500">Should be at least 8 characters</span>
          </Show>
        </div>
        <div class="space-y-2">
          <label for="confirm-password" class="uppercase">
            Confirm password
          </label>
          <div class="relative flex items-center">
            <input
              id="confirm-password"
              type={showConfirmedPassword() ? 'text' : 'password'}
              value={confirmedPassword()}
              onInput={(event) => setConfirmedPassword(event.target.value)}
              required
              pattern={onboardingStore.password}
              title="Passwords do not match"
              placeholder="Password"
              onFocus={() => setErrors('confirm', false)}
              onBlur={() => setErrors('confirm', confirmedPassword() !== onboardingStore.password)}
              classList={{
                'w-full bg-black border-thin rounded': true,
                'border-zinc-700': !errors.confirm,
                'border-red-500': errors.confirm,
              }}
            />
            <button
              type="button"
              onClick={() => setShowConfirmedPassword((prev) => !prev)}
              class="absolute right-2 z-10"
            >
              {showConfirmedPassword() ? <EyeSlashIcon /> : <EyeIcon />}
            </button>
          </div>
          <Show when={errors.confirm}>
            <span class="mt-2 text-xs text-red-500">Doesn't match password</span>
          </Show>
        </div>
        <div class="absolute w-[90%] bottom-0 space-y-4">
          <div
            classList={{
              'flex-between p-4 space-x-3 border-thin rounded hover:bg-zinc-700/20': true,
              'border-zinc-700/80': !policyAgreed(),
              'border-teal-800': policyAgreed(),
            }}
          >
            <p class="text-sm">
              I agree to the <span class="text-teal-500 underline">Terms</span> and{' '}
              <span class="text-teal-500 underline">Privacy Policy</span>
            </p>
            <input
              type="checkbox"
              checked={policyAgreed()}
              onChange={() => setPolicyAgreed(!policyAgreed())}
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
            type="submit"
            disabled={!stepIsValid()}
            classList={{
              'w-[100%] py-2 text-center border-thin border-zinc-700/80 rounded': true,
              'cursor-pointer hover:bg-zinc-700/20': stepIsValid(),
              'disabled:text-zinc-700': true,
            }}
          >
            Next
          </button>
        </div>
      </form>
    </div>
  );
};

const MnemonicStep: Component<StepProps> = (props) => {
  const [blurredOut, setBlurredOut] = createSignal(true);
  const wallet = Wallet.createRandom();

  setOnboardingStore({
    mnemonic: wallet.mnemonic,
    // FIX: This is Vitalik address, we use it in dev in order to have assets to display
    address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    // address: wallet.address,
  });

  return (
    <div class="relative h-[520px] p-3">
      <div class="flex-between">
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
      <div class="flex-between my-4">
        <div class="uppercase">recovery phrase</div>
        {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
        <Copy value={wallet.mnemonic!.phrase} />
      </div>
      <div class="flex items-center justify-around p-2 border-thin border-zinc-700/80 rounded">
        <p class="w-[92%] text-sm select-none" classList={{ blur: blurredOut() }}>
          {wallet.mnemonic?.phrase}
        </p>
        <button type="button" onClick={() => setBlurredOut((prev) => !prev)}>
          {blurredOut() ? <EyeIcon /> : <EyeSlashIcon />}
        </button>
      </div>
      <button
        type="button"
        class="absolute w-[90%] py-2 text-center bottom-0 border-thin border-zinc-700/80 rounded"
        onClick={props.onNext}
      >
        I saved it
      </button>
    </div>
  );
};

const SuccessStep: Component<Pick<StepProps, 'onNext'>> = (props) => (
  <div class="relative h-[520px] flex-center flex-col p-3">
    <div class="w-[87%] uppercase">all set!</div>
    <div class="text-5xl text-end">Your wallet is ready</div>
    <div class="mt-24 p-4 space-y-3 bg-gray-800/40 border-thin border-zinc-700/80 rounded">
      <div>Pin the Onix extension for easier access</div>
      <div class="flex items-center space-x-2">
        <div class="h-9 w-[85%] bg-zinc-800 rounded-r-full" />
        <PuzzlePieceIcon class="w-9 h-9 p-2 border-thin border-zinc-700 rounded-full" />
      </div>
      <div class="h-9 flex-between px-2 space-x-2 bg-zinc-800">
        <div>Onix</div>
        <ThumbstackIcon class="w-8 h-8 p-2 rounded-full" />
      </div>
    </div>
    <button
      type="button"
      onClick={props.onNext}
      class="absolute w-[90%] py-2 text-center bottom-0 border-thin border-zinc-700/80 rounded"
    >
      Finish
    </button>
  </div>
);
