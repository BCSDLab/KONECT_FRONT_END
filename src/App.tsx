import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout, AuthLayout, HomeLayout } from './components/Layout';
import ClubDetail from './pages/ClubDetail';
import ClubList from './pages/ClubList';
import ClubSearch from './pages/ClubSearch';
import CouncilDetail from './pages/CouncilDetail';
import Home from './pages/Home';
import Login from './pages/Login';
import FinishStep from './pages/SignUp/FinishStep';
import NameStep from './pages/SignUp/NameStep';
import SchoolStep from './pages/SignUp/SchoolStep';
import StudentIdStep from './pages/SignUp/StudentIdStep';
import TermStep from './pages/SignUp/TermStep';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup">
            <Route index element={<TermStep />} />
            <Route path="profile">
              <Route path="school" element={<SchoolStep />} />
              <Route path="student-id" element={<StudentIdStep />} />
              <Route path="name" element={<NameStep />} />
            </Route>
            <Route path="finish" element={<FinishStep />} />
          </Route>
        </Route>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/council" element={<CouncilDetail />} />
          <Route path="/council/notice/:noticeId" element={<CouncilDetail />} />
        </Route>
        <Route element={<AppLayout />}>
          <Route path="/clubs">
            <Route index element={<ClubList />} />
            <Route path="search" element={<ClubSearch />} />
            <Route path=":clubId" element={<ClubDetail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
