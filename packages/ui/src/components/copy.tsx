import { createEffect, createSignal, Match, Show, Switch } from 'solid-js';
import type { Component, JSX } from 'solid-js';
import { copyToClipboard } from '~/lib/utils';
import { CheckIcon } from './icons/check';
import { CopyIcon } from './icons/copy';

type CopyProps = {
  value: string;
  children?: JSX.Element;
};

export const Copy: Component<CopyProps> = (props) => {
  const [copying, setCopying] = createSignal(false);

  createEffect(() => {
    if (!copying()) return;
    setTimeout(() => {
      setCopying(false);
    }, 2000);
  });

  const copy = () => {
    setCopying(true);
    copyToClipboard(props.value);
  };

  return (
    <Show
      when={!copying()}
      fallback={
        <div class="flex items-center space-x-2 text-xs text-green-600">
          <span>Copied</span>
          <CheckIcon />
        </div>
      }
    >
      <button type="button" onClick={copy} class="flex items-center space-x-2">
        <Switch>
          <Match when={!!props.children}>{props.children}</Match>
          <Match when={!props.children}>
            <span class="text-xs uppercase">copy</span>
            <CopyIcon class="w-3 h-3" />
          </Match>
        </Switch>
      </button>
    </Show>
  );
};
