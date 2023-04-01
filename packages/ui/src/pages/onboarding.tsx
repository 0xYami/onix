import { createSignal, Match, Switch, type Component } from 'solid-js';
import { ChevronLeftIcon } from '../components/icons/chevron-left';

type StepName = 'home' | 'password' | 'mnemonic' | 'success';

export const Onboarding: Component = () => {
  const [currentStep, setCurrentStep] = createSignal<StepName>('home');
  return (
    <Switch>
      <Match when={currentStep() === 'home'}>
        <div class="relative h-[520px] flex flex-col items-center justify-center space-y-1">
          <span class="w-[70%] text-sm uppercase">welcome to</span>
          <span class="text-7xl font-bold">Onix</span>
          <span class="w-[70%] text-xs uppercase text-right text-zinc-400">
            where only you own it
          </span>
          <button
            type="button"
            class="absolute w-[90%] py-2 text-center bottom-0 border border-zinc-700/80 rounded"
            onClick={() => setCurrentStep(() => 'password')}
          >
            Create new wallet
          </button>
        </div>
      </Match>
      <Match when={currentStep() === 'password'}>
        <div class="relative h-[520px] p-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center py-4 space-x-2">
              <ChevronLeftIcon />
              <span>back</span>
            </div>
            <span class="text-sm">1/2</span>
          </div>
          <div class="text-xl font-bold mb-2">Set your password</div>
          <p class="text-xs text-zinc-400">
            You will use this password to unlock your wallet extension.
          </p>

          <form class="mt-3">
            <div class="flex flex-col mb-4 space-y-2">
              <label for="password" class="uppercase text-sm">
                enter password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Password"
                class="bg-black border-zinc-700 rounded"
              />
            </div>

            <div class="flex flex-col space-y-2">
              <label for="confirm-password" class="uppercase text-sm">
                Confirm password
              </label>
              <input
                id="confirm-password"
                type="password"
                placeholder="Password"
                class="bg-black border-zinc-700 rounded"
              />
            </div>
          </form>

          <button
            type="button"
            class="absolute w-[90%] py-2 text-center bottom-0 border border-zinc-700/80 rounded"
            onClick={() => setCurrentStep(() => 'mnemonic')}
          >
            Next
          </button>
        </div>
      </Match>
      <Match when={currentStep() === 'mnemonic'}>
        <div class="relative h-[520px] p-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center py-4 space-x-2">
              <ChevronLeftIcon />
              <span>back</span>
            </div>
            <span class="text-sm">2/2</span>
          </div>
          <div class="font-bold mb-2">Save your recovery phrase</div>
          <p class="text-xs text-zinc-400">
            You will use this to recover your account in case you lose your device or password.{' '}
            <span class="font-bold">Never share it with anyone!</span>
          </p>
          <div class="my-4 uppercase">recovery phrase</div>
          <p class="p-2 text-sm border border-zinc-700/80 rounded">
            {'vault below speed impose cinnamon agree basic husband festival beach federal supreme'}
          </p>
          <button
            type="button"
            class="absolute w-[90%] py-2 text-center bottom-0 border border-zinc-700/80 rounded"
            onClick={() => setCurrentStep(() => 'mnemonic')}
          >
            I saved it
          </button>
        </div>
      </Match>
    </Switch>
  );
};
