import type { Component } from 'solid-js';
import { Link } from '~/components/link';

export const Welcome: Component = () => {
  return (
    <div class="relative h-[520px] flex flex-col items-center justify-center space-y-1">
      <span class="w-[70%] text-sm uppercase">welcome to</span>
      <span class="text-7xl font-bold">Onix</span>
      <span class="w-[70%] text-xs uppercase text-right text-zinc-400">where only you own it</span>
      <Link
        path="/onboarding"
        class="absolute w-[90%] py-2 text-center bottom-0 border border-zinc-700/80 rounded"
      >
        Create new wallet
      </Link>
    </div>
  );
};
