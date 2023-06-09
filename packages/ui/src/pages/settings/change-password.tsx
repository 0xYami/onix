import { createSignal, Match, Switch, type Component } from 'solid-js';
import { useNavigate } from '@solidjs/router';
import { storeActions } from '~/store';
import { ChevronLeftIcon } from '~/components/icons/chevron-left';
import { EyeIcon } from '~/components/icons/eye';
import { EyeSlashIcon } from '~/components/icons/eye-slash';
import { Link } from '~/components/link';
import { AuthStep } from './index';

export const ChangePassword: Component = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = createSignal<'authenticate' | 'change'>('authenticate');

  const changePassword = (password: string) => {
    storeActions.changePassword(password);
    navigate('/index.html');
  };

  return (
    <div class="h-full flex flex-col p-4 space-y-2">
      <Link path="/settings" class="flex items-center space-x-1 mb-4">
        <ChevronLeftIcon />
        <span class="text-sm">Settings / Change password</span>
      </Link>
      <Switch>
        <Match when={currentStep() === 'authenticate'}>
          <AuthStep onNext={() => setCurrentStep(() => 'change')} />
        </Match>
        <Match when={currentStep() === 'change'}>
          <ChangePasswordStep onNext={changePassword} />
        </Match>
      </Switch>
    </div>
  );
};

const ChangePasswordStep: Component<{ onNext: (password: string) => void }> = (props) => {
  const [password, setPassword] = createSignal('');
  const [confirmedPassword, setConfirmedPassword] = createSignal('');
  const [showPassword, setShowPassword] = createSignal(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = createSignal(false);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        props.onNext(password());
      }}
      class="relative h-full mb-4"
    >
      <div class="mb-4 space-y-2">
        <label for="password" class="uppercase">
          enter new password
        </label>
        <div class="relative flex items-center">
          <input
            id="password"
            type={showPassword() ? 'text' : 'password'}
            value={password()}
            onInput={(event) => setPassword(() => event.target.value)}
            autofocus
            required
            pattern=".{8,}"
            title="Password must be at least 8 characters long"
            placeholder="Password"
            class="w-full bg-black border-thin border-zinc-700 rounded"
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
      <div class="space-y-2">
        <label for="confirm-password" class="uppercase">
          Confirm new password
        </label>
        <div class="relative flex items-center">
          <input
            id="confirm-password"
            type={showConfirmedPassword() ? 'text' : 'password'}
            value={confirmedPassword()}
            onInput={(event) => setConfirmedPassword(event.target.value)}
            required
            pattern={confirmedPassword()}
            title="Passwords do not match"
            placeholder="Password"
            class="w-full bg-black border-thin border-zinc-700 rounded"
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
        class="w-[100%] absolute bottom-0 py-2 text-center border-thin border-zinc-700/80 rounded hover:bg-zinc-700/20"
      >
        Save
      </button>
    </form>
  );
};
