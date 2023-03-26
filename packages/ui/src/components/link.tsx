import type { ParentComponent } from 'solid-js';
import { A } from '@solidjs/router';

type LinkProps = {
  path: `/${string}`;
};

export const Link: ParentComponent<LinkProps> = (props) => {
  return <A href={`/index.html${props.path}`}>{props.children}</A>;
};
