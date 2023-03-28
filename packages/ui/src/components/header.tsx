import type { Component } from 'solid-js';
import { asyncFaillable } from '@onix/utils'
import { truncateMiddle } from '../lib/utils';

export const Header: Component<{ address: string }> = (props) => {
  const copyAddress = async () => {
    const result = await asyncFaillable(navigator.clipboard.writeText(props.address))
    if (result.failed) {
      console.error('Failed to copy address', result.reason)
    }
  }

  return (
    <header class="relative h-[48px] flex items-center px-4 space-x-2 border-b-[0.3px] border-zinc-700 text-xs">
      <div class="flex items-center space-x-1">
        <div class="w-[7px] h-[7px] rounded-full bg-green-600" />
        <span class="font-bold uppercase">mainnet</span>
      </div>
      <div class="flex items-center space-x-1">
        <img src="/icons/gas-pump.svg" alt="Gas Pump Icon" class="w-[14px] h-[14px]" />
        <span>$2.01</span>
      </div>
      <div class="absolute right-0 pr-4 flex items-center space-x-1">
        <button type="button" onClick={copyAddress}>
          <img src="/icons/copy.svg" alt="Copy Icon" class="w-[14px] h-[14px]" />
        </button>
        <span>{truncateMiddle(props.address, 11)}</span>
      </div>
    </header>
  )
};
