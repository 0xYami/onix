import type { Component } from 'solid-js';
import { Routes, Route, Navigate } from '@solidjs/router';
import { Home } from './pages/home';
import { Onboarding } from './pages/onboarding';

const App: Component = () => {
  return (
    <div class="w-[360px] h-[540px] text-white bg-black border border-zinc-700">
      <Routes>
        <Route path="/" element={<Navigate href="/index.html" />} />
        <Route path="/index.html" component={Home} />
        <Route path="/index.html/onboarding" component={Onboarding} />
      </Routes>
    </div>
  );
};

export default App;
