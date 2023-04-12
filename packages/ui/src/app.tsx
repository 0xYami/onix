import { ErrorBoundary, Show, type Component, type JSX } from 'solid-js';
import { Routes, Route, Navigate, Outlet } from '@solidjs/router';
import { userStore } from './store';
import { storage } from './lib/storage';
import { Activity } from './pages/activity';
import { Asset } from './pages/asset';
import { Collection } from './pages/collection';
import { Collections } from './pages/collections';
import { Home } from './pages/home';
import { NFT } from './pages/nft';
import { Onboarding } from './pages/onboarding';
import { Settings } from './pages/settings';
import { ChangePassword } from './pages/settings/change-password';
import { Welcome } from './pages/welcome';

type ProtectedRouteProps = {
  allowWhen: boolean;
  fallback: JSX.Element;
};

const ProtectedRoute: Component<ProtectedRouteProps> = (props) => (
  <Show when={props.allowWhen} fallback={props.fallback}>
    <Outlet />
  </Show>
);

const App: Component = () => {
  const userState = storage.getUserState();
  if (userState) {
    userStore.initialize(userState);
  }
  return (
    <ErrorBoundary fallback={<div>Something went wrong :(</div>}>
      <div class="w-[360px] h-[540px] max-h-[540px] relative text-white bg-black border-[0.3px] border-zinc-700">
        <Routes>
          <Route path="/" element={<Navigate href="/index.html" />} />
          <Route
            path=""
            element={
              <ProtectedRoute
                allowWhen={!userStore.isAuthenticated}
                fallback={<Navigate href="/index.html/home" />}
              />
            }
          >
            <Route path="/index.html" component={Welcome} />
            <Route path="/index.html/onboarding" component={Onboarding} />
          </Route>
          <Route
            path=""
            element={
              <ProtectedRoute
                allowWhen={userStore.isAuthenticated}
                fallback={<Navigate href="/index.html" />}
              />
            }
          >
            <Route path="/index.html/home" component={Home} />
            <Route path="/index.html/assets/:contractAddress" component={Asset} />
            <Route path="/index.html/collections" component={Collections} />
            <Route path="/index.html/collections/:contractAddress" component={Collection} />
            <Route path="/index.html/collections/:contractAddress/:tokenId" component={NFT} />
            <Route path="/index.html/activity" component={Activity} />
            <Route path="/index.html/settings" component={Settings} />
            <Route path="/index.html/settings/change-password" component={ChangePassword} />
          </Route>
        </Routes>
      </div>
    </ErrorBoundary>
  );
};

export default App;
