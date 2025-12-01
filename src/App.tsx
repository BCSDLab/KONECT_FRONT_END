import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/Layout';
import ClubList from './pages/ClubList';
import ClubSearch from './pages/ClubSearch';
import Home from './pages/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/clubs">
            <Route index element={<ClubList />} />
            <Route path="search" element={<ClubSearch />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
