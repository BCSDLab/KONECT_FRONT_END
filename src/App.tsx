import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from './components/Layout';
import ClubList from './pages/ClubList';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<div>Home</div>} />
          <Route path="/clubs" element={<ClubList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
