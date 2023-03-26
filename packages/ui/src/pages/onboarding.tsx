import type { Component } from 'solid-js';
import { Link } from '../components/link';

export const Onboarding: Component = () => {
  return (
    <div>
      <h1>Onboarding page</h1>
      <Link path="/">Go to home page</Link>
    </div>
  );
};
