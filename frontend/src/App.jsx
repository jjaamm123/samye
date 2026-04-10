import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TourDetails from './pages/TourDetails';
import AdminDashboard from './pages/AdminDashboard';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tour/:id" element={<TourDetails />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;