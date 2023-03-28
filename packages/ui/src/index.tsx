/* @refresh reload */
import { render } from 'solid-js/web';
import { Router } from '@solidjs/router';
import { QueryClient, QueryClientProvider } from '@tanstack/solid-query';
import './index.css';
import App from './app';

const root = document.getElementById('root');

if (!root || (import.meta.env.DEV && !(root instanceof HTMLElement))) {
  throw new Error('Root element not found');
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <Router>
        <App />
      </Router>
    </QueryClientProvider>
  ),
  root,
);
