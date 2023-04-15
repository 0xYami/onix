import type { Component } from 'solid-js';
import { Link } from '~/components/link';

export const Welcome: Component = () => {
  return (
    <div class="relative h-[520px] flex-center flex-col space-y-1">
      <div class="w-[70%] text-sm uppercase">welcome to</div>
      <div class="text-7xl font-bold">Onix</div>
      <div class="w-[70%] text-xs uppercase text-right text-zinc-400">where only you own it</div>
      <Link
        path="/onboarding"
        class="absolute w-[90%] py-2 text-center bottom-0 border-thin border-zinc-700/80 rounded"
      >
        Create new wallet
      </Link>
    </div>
  );
};
