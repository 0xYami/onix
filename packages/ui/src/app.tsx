import { ErrorBoundary, Show, type Component, type JSX } from 'solid-js';
import { Routes, Route, Navigate, Outlet } from '@solidjs/router';
import { store } from '~/store';
import { Activity } from './pages/activity';
import { Asset } from './pages/asset';
import { Collection } from './pages/collection';
import { Collections } from './pages/collections';
import { Home } from './pages/home';
import { Login } from './pages/login';
import { NFT } from './pages/nft';
import { Onboarding } from './pages/onboarding';
import { Settings } from './pages/settings';
import { ViewAccount } from './pages/settings/view-account';
import { CreateAccount } from './pages/settings/create-account';
import { EditAccount } from './pages/settings/edit-account';
import { ChangePassword } from './pages/settings/change-password';
import { RemoveAccount } from './pages/settings/remove-account';
import { Reveal } from './pages/settings/reveal';
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
  return (
    <ErrorBoundary fallback={<div>Something went wrong :(</div>}>
      <div class="w-[360px] h-[540px] max-h-[540px] relative text-white bg-black border-thin border-zinc-700">
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
              <Route path="/change-password" component={ChangePassword} />
              <Route path="/accounts/create" component={CreateAccount} />
              <Route path="/accounts/edit" component={EditAccount} />
              <Route path="/accounts/remove" component={RemoveAccount} />
              <Route path="/accounts/:address" component={ViewAccount} />
              <Route path="/reveal-private-key" element={<Reveal operation="private-key" />} />
              <Route path="/reveal-mnemonic" element={<Reveal operation="mnemonic" />} />
            </Route>
          </Route>
        </Routes>
      </div>
    </ErrorBoundary>
  );
};

export default App;
