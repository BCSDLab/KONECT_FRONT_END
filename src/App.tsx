import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout, HomeLayout } from './components/Layout';
import ClubDetail from './pages/ClubDetail';
import ClubList from './pages/ClubList';
import ClubSearch from './pages/ClubSearch';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<Home />} />
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
