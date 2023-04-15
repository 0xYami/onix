import { ErrorBoundary, Show, type Component, type JSX } from 'solid-js';
import { Routes, Route, Navigate, Outlet } from '@solidjs/router';
import { store } from './lib/store';
import { storage } from './lib/storage';
import { Activity } from './pages/activity';
import { Asset } from './pages/asset';
import { Collection } from './pages/collection';
import { Collections } from './pages/collections';
import { Home } from './pages/home';
import { Login } from './pages/login';
import { NFT } from './pages/nft';
import { Onboarding } from './pages/onboarding';
import { Settings } from './pages/settings';
import { Account } from './pages/settings/account';
import { Accounts } from './pages/settings/accounts';
import { ChangePassword } from './pages/settings/change-password';
import { Reveal } from './pages/settings/reveal';
import { Remove } from './pages/settings/remove';
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
    store.initialize(userState);
  }
  return (
    <ErrorBoundary fallback={<div>Something went wrong :(</div>}>
      <div class="w-[360px] h-[540px] max-h-[540px] relative text-white bg-black border-[0.3px] border-zinc-700">
        <Routes>
          <Route path="/" element={<Navigate href="/index.html" />} />
          <Route
            path="/index.html"
            element={
              <ProtectedRoute
                allowWhen={store.status === 'uninitialized'}
                fallback={<Navigate href="/index.html/home" />}
              />
            }
          >
            <Route path="/" component={Welcome} />
            <Route path="/onboarding" component={Onboarding} />
          </Route>
          <Route
            path="/index.html"
            element={
              <ProtectedRoute
                allowWhen={store.status === 'logged-out'}
                fallback={<Navigate href="/index.html" />}
              />
            }
          >
            <Route path="/login" component={Login} />
          </Route>
          <Route
            path="/index.html"
            element={
              <ProtectedRoute
                allowWhen={store.status === 'logged-in'}
                fallback={<Navigate href="/index.html/login" />}
              />
            }
          >
            <Route path="/home" component={Home} />
            <Route path="/assets/:contractAddress" component={Asset} />
            <Route path="/collections">
              <Route path="/" component={Collections} />
              <Route path="/:contractAddress" component={Collection} />
              <Route path="/:contractAddress/:tokenId" component={NFT} />
            </Route>
            <Route path="/activity" component={Activity} />
            <Route path="/settings">
              <Route path="/" component={Settings} />
              <Route path="/accounts" component={Accounts} />
              <Route path="/accounts/view/:address" component={Account} />
              <Route path="/change-password" component={ChangePassword} />
              <Route path="/reveal-private-key" element={<Reveal operation="private-key" />} />
              <Route path="/reveal-mnemonic" element={<Reveal operation="mnemonic" />} />
              <Route path="/remove" component={Remove} />
            </Route>
          </Route>
        </Routes>
      </div>
    </ErrorBoundary>
  );
};

export default App;
