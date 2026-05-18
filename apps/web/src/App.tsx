import * as Sentry from '@sentry/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './layout';
import Home from './pages/Home';

const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);

function App() {
  return (
    <BrowserRouter>
      <SentryRoutes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
        </Route>
      </SentryRoutes>
    </BrowserRouter>
  );
}

export default App;
