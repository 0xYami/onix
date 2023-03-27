import { Component, ErrorBoundary } from 'solid-js';
import { Routes, Route, Navigate } from '@solidjs/router';
import { Home } from './pages/home';
import { Onboarding } from './pages/onboarding';
import { Header } from './components/header';

const App: Component = () => {
  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <div class="w-[360px] h-[540px] text-white bg-black border border-zinc-700">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate href="/index.html" />} />
          <Route path="/index.html" component={Home} />
          <Route path="/index.html/onboarding" component={Onboarding} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
};

export default App;
