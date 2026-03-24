import { lazy, Suspense } from 'react';
import * as Sentry from '@sentry/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RouteLoadingFallback from '@/components/common/RouteLoadingFallback';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
import Layout from './components/layout';
import Login from './pages/Auth/Login';
import Home from './pages/Home';
import NotFoundPage from './pages/NotFound';
import ServerErrorPage from './pages/ServerError';

const ConfirmStep = lazy(() => import('./pages/Auth/SignUp/ConfirmStep'));
const FinishStep = lazy(() => import('./pages/Auth/SignUp/FinishStep'));
const NameStep = lazy(() => import('./pages/Auth/SignUp/NameStep'));
const StudentIdStep = lazy(() => import('./pages/Auth/SignUp/StudentIdStep'));
const TermStep = lazy(() => import('./pages/Auth/SignUp/TermStep'));
const UniversityStep = lazy(() => import('./pages/Auth/SignUp/UniversityStep'));
const ChatListPage = lazy(() => import('./pages/Chat'));
const ChatRoom = lazy(() => import('./pages/Chat/ChatRoom'));
const ApplicationPage = lazy(() => import('./pages/Club/Application'));
const ApplyCompletePage = lazy(() => import('./pages/Club/Application/applyCompletePage'));
const ClubFeePage = lazy(() => import('./pages/Club/Application/clubFeePage'));
const ClubDetail = lazy(() => import('./pages/Club/ClubDetail'));
const ClubList = lazy(() => import('./pages/Club/ClubList'));
const ClubSearch = lazy(() => import('./pages/Club/ClubSearch'));
const CouncilDetail = lazy(() => import('./pages/Council/CouncilDetail'));
const CouncilNotice = lazy(() => import('./pages/Council/CouncilNotice'));
const GuidePage = lazy(() => import('./pages/Guide'));
const LicensePage = lazy(() => import('./pages/legal/LicensePage'));
const MarketingPolicyPage = lazy(() => import('./pages/legal/MarketingPolicyPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/legal/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/legal/TermsPage'));
const ManagedAccount = lazy(() => import('./pages/Manager/ManagedAccount'));
const ManagedApplicationDetail = lazy(() => import('./pages/Manager/ManagedApplicationDetail'));
const ManagedApplicationList = lazy(() => import('./pages/Manager/ManagedApplicationList'));
const ManagedClubDetail = lazy(() => import('./pages/Manager/ManagedClubDetail'));
const ManagedClubInfo = lazy(() => import('./pages/Manager/ManagedClubProfile'));
const ManagedClubList = lazy(() => import('./pages/Manager/ManagedClubList'));
const ManagedMemberApplicationDetail = lazy(() => import('./pages/Manager/ManagedMemberApplicationDetail'));
const ManagedMemberList = lazy(() => import('./pages/Manager/ManagedMemberList'));
const ManagedRecruitment = lazy(() => import('./pages/Manager/ManagedRecruitment'));
const ManagedRecruitmentForm = lazy(() => import('./pages/Manager/ManagedRecruitmentForm'));
const ManagedRecruitmentWrite = lazy(() => import('./pages/Manager/ManagedRecruitmentWrite'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Timer = lazy(() => import('./pages/Timer'));
const MyPage = lazy(() => import('./pages/User/MyPage'));
const Profile = lazy(() => import('./pages/User/Profile'));

const SentryRoutes = Sentry.withSentryReactRouterV7Routing(Routes);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoadingFallback fullScreen />}>
        <SentryRoutes>
          <Route element={<PublicRoute />}>
            <Route element={<Layout contentClassName="bg-indigo-0" />}>
              <Route path="/" element={<Login />} />
              <Route path="signup">
                <Route index element={<TermStep />} />
                <Route path="university" element={<UniversityStep />} />
                <Route path="studentid" element={<StudentIdStep />} />
                <Route path="name" element={<NameStep />} />
                <Route path="confirm" element={<ConfirmStep />} />
              </Route>
            </Route>
          </Route>

          <Route element={<Layout contentClassName="bg-indigo-0" />}>
            <Route path="/signup/finish" element={<FinishStep />} />
          </Route>
          <Route path="/guide" element={<GuidePage />} />

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
              <Route path="mypage">
                <Route index element={<MyPage />} />
                <Route path="manager">
                  <Route index element={<ManagedClubList />} />
                  <Route path=":clubId" element={<ManagedClubDetail />} />
                  <Route path=":clubId/members" element={<ManagedMemberList />} />
                  <Route path=":clubId/members/:userId/application" element={<ManagedMemberApplicationDetail />} />
                  <Route path=":clubId/recruitment" element={<ManagedRecruitment />} />
                  <Route path=":clubId/applications" element={<ManagedApplicationList />} />
                  <Route path=":clubId/applications/:applicationId" element={<ManagedApplicationDetail />} />
                </Route>
              </Route>
              <Route path="timer" element={<Timer />} />
              <Route path="chats" element={<ChatListPage />} />
              <Route path="clubs">
                <Route index element={<ClubList />} />
                <Route path="search" element={<ClubSearch />} />
              </Route>
            </Route>
            <Route element={<Layout />}>
              <Route path="clubs/:clubId" element={<ClubDetail />} />
              <Route path="clubs/:clubId/applications" element={<ApplicationPage />} />
              <Route path="clubs/:clubId/fee" element={<ClubFeePage />} />
              <Route path="clubs/:clubId/complete" element={<ApplyCompletePage />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="mypage/manager/:clubId/info" element={<ManagedClubInfo />} />
              <Route path="mypage/manager/:clubId/recruitment/form" element={<ManagedRecruitmentForm />} />
              <Route path="mypage/manager/:clubId/recruitment/write" element={<ManagedRecruitmentWrite />} />
              <Route path="mypage/manager/:clubId/recruitment/account" element={<ManagedAccount />} />
              <Route path="profile" element={<Profile />} />
              <Route path="council">
                <Route index element={<CouncilDetail />} />
                <Route path="notice/:noticeId" element={<CouncilNotice />} />
              </Route>
              <Route path="chats/:chatRoomId" element={<ChatRoom />} />
            </Route>
          </Route>

          <Route path="server-error" element={<ServerErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </SentryRoutes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
