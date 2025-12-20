import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout, AuthLayout, HomeLayout } from './components/Layout';
import ApplicationPage from './pages/Application';
import ApplyFinishPage from './pages/Application/applyFinishPage';
import ClubFeePage from './pages/Application/clubFeePage';
import ClubDetail from './pages/ClubDetail';
import ClubList from './pages/ClubList';
import ClubSearch from './pages/ClubSearch';
import CouncilDetail from './pages/CouncilDetail';
import CouncilNotice from './pages/CouncilNotice';
import Home from './pages/Home';
import LicensePage from './pages/legal/LicensePage';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import TermsPage from './pages/legal/TermsPage';
import Login from './pages/Login';
import MyPage from './pages/MyPage';
import Profile from './pages/Profile';
import FinishStep from './pages/SignUp/FinishStep';
import NameStep from './pages/SignUp/NameStep';
import StudentIdStep from './pages/SignUp/StudentIdStep';
import TermStep from './pages/SignUp/TermStep';
import UniversityStep from './pages/SignUp/UniversityStep';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/signup">
            <Route index element={<TermStep />} />
            <Route path="university" element={<UniversityStep />} />
            <Route path="student-id" element={<StudentIdStep />} />
            <Route path="name" element={<NameStep />} />
            <Route path="finish" element={<FinishStep />} />
          </Route>
        </Route>
        <Route element={<HomeLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/me" element={<MyPage />} />
          <Route path="/council">
            <Route index element={<CouncilDetail />} />
            <Route path="notice/:noticeId" element={<CouncilNotice />} />
          </Route>
        </Route>
        <Route element={<AppLayout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="legal">
            <Route path="oss" element={<LicensePage />} />
            <Route path="terms" element={<TermsPage />} />
            <Route path="privacy" element={<PrivacyPolicyPage />} />
          </Route>
          <Route path="/clubs">
            <Route index element={<ClubList />} />
            <Route path="search" element={<ClubSearch />} />
            <Route path=":clubId" element={<ClubDetail />} />
            <Route path=":clubId/applications" element={<ApplicationPage />} />
            <Route path=":clubId/fee" element={<ClubFeePage />} />
            <Route path=":clubId/finish" element={<ApplyFinishPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
