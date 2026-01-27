import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthGuard from './components/auth/AuthGuard';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import Layout from './components/layout';
import Login from './pages/Auth/Login';
import ConfirmStep from './pages/Auth/SignUp/ConfirmStep';
import FinishStep from './pages/Auth/SignUp/FinishStep';
import NameStep from './pages/Auth/SignUp/NameStep';
import StudentIdStep from './pages/Auth/SignUp/StudentIdStep';
import TermStep from './pages/Auth/SignUp/TermStep';
import UniversityStep from './pages/Auth/SignUp/UniversityStep';
import ChatListPage from './pages/Chat';
import ChatRoom from './pages/Chat/ChatRoom';
import ApplicationPage from './pages/Club/Application';
import ApplyCompletePage from './pages/Club/Application/applyCompletePage';
import ClubFeePage from './pages/Club/Application/clubFeePage';
import ClubDetail from './pages/Club/ClubDetail';
import ClubList from './pages/Club/ClubList';
import ClubSearch from './pages/Club/ClubSearch';
import CouncilDetail from './pages/Council/CouncilDetail';
import CouncilNotice from './pages/Council/CouncilNotice';
import Home from './pages/Home';
import LicensePage from './pages/legal/LicensePage';
import MarketingPolicyPage from './pages/legal/MarketingPolicyPage';
import PrivacyPolicyPage from './pages/legal/PrivacyPolicyPage';
import TermsPage from './pages/legal/TermsPage';
import Schedule from './pages/Schedule';
import Timer from './pages/Timer';
import MyPage from './pages/User/MyPage';
import Profile from './pages/User/Profile';

function App() {
  return (
    <BrowserRouter>
      <AuthGuard>
        <Routes>
          <Route element={<PublicRoute />}>
            <Route element={<Layout contentClassName="bg-indigo-0" />}>
              <Route path="/" element={<Login />} />
              <Route path="signup">
                <Route index element={<TermStep />} />
                <Route path="university" element={<UniversityStep />} />
                <Route path="studentid" element={<StudentIdStep />} />
                <Route path="name" element={<NameStep />} />
                <Route path="confirm" element={<ConfirmStep />} />
                <Route path="finish" element={<FinishStep />} />
              </Route>
            </Route>
          </Route>

          <Route element={<Layout />}>
            <Route path="legal">
              <Route path="oss" element={<LicensePage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="privacy" element={<PrivacyPolicyPage />} />
              <Route path="marketing" element={<MarketingPolicyPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout showBottomNav />}>
              <Route path="home" element={<Home />} />
              <Route path="me" element={<MyPage />} />
              <Route path="timer" element={<Timer />} />
              <Route path="clubs">
                <Route index element={<ClubList />} />
                <Route path="search" element={<ClubSearch />} />
                <Route path=":clubId" element={<ClubDetail />} />
                <Route path=":clubId/applications" element={<ApplicationPage />} />
                <Route path=":clubId/fee" element={<ClubFeePage />} />
                <Route path=":clubId/complete" element={<ApplyCompletePage />} />
              </Route>
            </Route>
            <Route element={<Layout />}>
              <Route path="profile" element={<Profile />} />
              <Route path="council">
                <Route index element={<CouncilDetail />} />
                <Route path="notice/:noticeId" element={<CouncilNotice />} />
              </Route>
              <Route path="chats">
                <Route index element={<ChatListPage />} />
                <Route path=":chatRoomId" element={<ChatRoom />} />
              </Route>
              <Route path="schedules" element={<Schedule />} />
            </Route>
          </Route>
        </Routes>
      </AuthGuard>
    </BrowserRouter>
  );
}

export default App;
