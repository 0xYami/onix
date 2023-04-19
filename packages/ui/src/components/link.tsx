import type { ParentComponent } from 'solid-js';
import { A, type AnchorProps } from '@solidjs/router';

type LinkProps = Omit<AnchorProps, 'href'> & {
  path: `/${string}`;
};

export const Link: ParentComponent<LinkProps> = (props) => {
  const href = '/index.html';
  return (
    // To correctly match active class
    <A href={props.path === '/' ? href : href + props.path} {...props}>
      {props.children}
    </A>
  );
};
