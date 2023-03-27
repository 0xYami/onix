import { Component, ErrorBoundary } from 'solid-js';
import { Routes, Route, Navigate } from '@solidjs/router';
import { Home } from './pages/home';
import { Onboarding } from './pages/onboarding';
import { Header } from './components/header';

const App: Component = () => {
  const address = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <div class="w-[360px] h-[540px] text-white bg-black border border-zinc-700">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate href="/index.html" />} />
          <Route path="/index.html" element={<Home address={address} />} />
          <Route path="/index.html/onboarding" component={Onboarding} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
};

export default App;
