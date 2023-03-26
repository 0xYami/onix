import type { Component } from 'solid-js';
import { Link } from '../components/link';

export const Home: Component = () => {
  return (
    <div>
      <h1>Home page</h1>
      <Link path="/onboarding">Go to onboarding</Link>
    </div>
  );
};
