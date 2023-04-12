import { createMemo, createSignal, Match, Show, Switch, type Component } from 'solid-js';
import { userStore } from '../../store';
import { ChevronLeftIcon } from '../../components/icons/chevron-left';
import { EyeIcon } from '../../components/icons/eye';
import { EyeSlashIcon } from '../../components/icons/eye-slash';
import { Link } from '../../components/link';

export const ChangePassword: Component = () => {
  const [currentStep, setCurrentStep] = createSignal<'authenticate' | 'change'>('authenticate');
  return (
    <div class="flex flex-col w-[360px] h-[540px] p-4 space-y-2 text-white bg-black border-[0.3px] border-zinc-700">
      <Link path="/settings" class="flex items-center space-x-1">
        <ChevronLeftIcon />
        <span>Settings / Change password</span>
      </Link>
      <Switch>
        <Match when={currentStep() === 'authenticate'}>
          <AuthStep onNext={() => setCurrentStep(() => 'change')} />
        </Match>
        <Match when={currentStep() === 'change'}>
          <div>Foo</div>
        </Match>
      </Switch>
    </div>
  );
};

type StepProps = {
  onNext: () => void;
};

const AuthStep: Component<StepProps> = (props) => {
  const [password, setPassword] = createSignal('');
  const [showPassword, setShowPassword] = createSignal(false);
  const [hasError, setHasError] = createSignal(false);
  const isValid = createMemo(() => userStore.password === password());
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        props.onNext();
      }}
      class="relative h-full flex flex-col mb-4"
    >
      <label for="password" class="uppercase mt-4 mb-2">
        enter password
      </label>
      <div class="relative flex items-center">
        <input
          id="password"
          type={showPassword() ? 'text' : 'password'}
          value={password()}
          onInput={(event) => setPassword(event.currentTarget.value)}
          required
          autofocus
          onFocus={() => setHasError(false)}
          onBlur={() => {
            if (isValid()) return;
            setHasError(true);
          }}
          pattern={userStore.password!}
          title="Doesn't match current password"
          placeholder="Password"
          class="w-full bg-black border-[] border-zinc-700 rounded"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          class="absolute right-2 z-10"
        >
          {showPassword() ? <EyeSlashIcon /> : <EyeIcon />}
        </button>
      </div>
      <Show when={hasError()}>
        <span class="mt-2 text-xs text-red-500">Doesn't match current password</span>
      </Show>
      <button
        type="submit"
        classList={{
          'absolute w-[100%] py-2 bottom-0 text-center': true,
          'border-[0.3px] border-zinc-700/80 cursor-pointer hover:bg-zinc-700/20 rounded': true,
        }}
      >
        Next
      </button>
    </form>
  );
};
