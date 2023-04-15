import type { ParentComponent } from 'solid-js';
import { Header } from '~/components/header';
import { Link } from '~/components/link';
import { BoltIcon } from '~/components/icons/bolt';
import { GemIcon } from '~/components/icons/gem';
import { HomeIcon } from '~/components/icons/home';

export const MainLayout: ParentComponent = (props) => {
  return (
    <>
      <Header />
      {props.children}
      <nav class="absolute w-full h-12 bottom-0 flex items-center bg-black border-t-thin border-zinc-700 z-10">
        <Link path="/home" end class="w-full h-full flex-center" activeClass="text-teal-500">
          <HomeIcon />
        </Link>
        <Link path="/collections" class="w-full h-full flex-center" activeClass="text-teal-500">
          <GemIcon />
        </Link>
        <Link path="/activity" class="w-full h-full flex-center" activeClass="text-teal-500">
          <BoltIcon />
        </Link>
      </nav>
    </>
  );
};
