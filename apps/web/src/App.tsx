import * as Sentry from '@sentry/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Layout from './layout';
import ClubDetail from './pages/ClubDetail';
import Home from './pages/Home';
import RegisterClub from './pages/RegisterClub';
import UniversityClubList from './pages/UniversityClubList';

const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);

function App() {
  return (
    <BrowserRouter>
      <SentryRoutes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/universities/:universityId/clubs" element={<UniversityClubList />} />
          <Route path="/clubs/:clubId" element={<ClubDetail />} />
          <Route path="/clubs/register" element={<RegisterClub />} />
        </Route>
      </SentryRoutes>
    </BrowserRouter>
  );
}

export default App;
