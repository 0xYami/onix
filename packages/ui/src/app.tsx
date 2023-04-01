import { ErrorBoundary, type Component } from 'solid-js';
import { Routes, Route, Navigate } from '@solidjs/router';
import { Asset } from './pages/asset';
import { Collection } from './pages/collection';
import { Collections } from './pages/collections';
import { Home } from './pages/home';
import { NFT } from './pages/nft';
import { Onboarding } from './pages/onboarding';

const App: Component = () => {
  const address = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045';
  return (
    <ErrorBoundary fallback={<div>Something went wrong :(</div>}>
      <div class="w-[360px] h-[540px] max-h-[540px] relative text-white bg-black border-[0.3px] border-zinc-700">
        <Routes>
          <Route path="/" element={<Navigate href="/index.html" />} />
          <Route path="/index.html/onboarding" component={Onboarding} />
          <Route path="/index.html/assets/:contractAddress" element={<Asset address={address} />} />
          <Route path="/index.html/collections" element={<Collections address={address} />} />
          <Route
            path="/index.html/collections/:contractAddress"
            element={<Collection address={address} />}
          />
          <Route
            path="/index.html/collections/:contractAddress/:tokenId"
            element={<NFT address={address} />}
          />
          <Route path="/index.html" element={<Home address={address} />} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
};

export default App;
