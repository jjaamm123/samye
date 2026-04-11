import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TourDetails from './pages/TourDetails';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';     
import Gallery from './pages/Gallery'; 
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tour/:id" element={<TourDetails />} />
      <Route path="/admin" element={<AdminDashboard />} />
      
      <Route path="/about" element={<About />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>
  );
}

export default App;