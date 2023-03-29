import type { ParentComponent } from 'solid-js';
import { A } from '@solidjs/router';

type LinkProps = {
  path: `/${string}`;
  end?: boolean;
  class?: string;
  activeClass?: string;
};

export const Link: ParentComponent<LinkProps> = (props) => {
  let href = '/index.html';
  // To correctly match active class
  if (props.path !== '/') href += props.path;
  return (
    <A href={href} end={props.end} class={props.class} activeClass={props.activeClass}>
      {props.children}
    </A>
  );
};
