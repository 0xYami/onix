import type { ParentComponent } from 'solid-js';
import { Header } from '../components/header';
import { Link } from '../components/link';
import { BoltIcon } from '../components/icons/bolt';
import { GemIcon } from '../components/icons/gem';
import { HomeIcon } from '../components/icons/home';

export const MainLayout: ParentComponent = (props) => {
  const address = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';
  return (
    <>
      <Header address={address} />
      {props.children}
      <nav class="absolute w-full h-[48px] px-2 bottom-0 flex items-center bg-black border-t-[0.3px] border-zinc-700 z-10">
        <Link
          path="/home"
          end
          class="w-full h-full flex items-center justify-center"
          activeClass="text-teal-500"
        >
          <HomeIcon />
        </Link>
        <Link
          path="/collections"
          class="w-full h-full flex items-center justify-center"
          activeClass="text-teal-500"
        >
          <GemIcon />
        </Link>
        <Link
          path="/activity"
          class="w-full h-full flex items-center justify-center"
          activeClass="text-teal-500"
        >
          <BoltIcon />
        </Link>
      </nav>
    </>
  );
};
