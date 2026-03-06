import { Routes, Route } from 'react-router-dom';
import { Toaster } from "sonner";
import Navbar from './components/layout/NavBar';
import HomePage from './pages/HomePage';
import MovieDetailPage from './pages/MovieDetailPage';
import SearchPage from './pages/SearchPage';
import FavoritesPage from './pages/FavoritesPage';
import Footer from './components/layout/Footer';
import './index.css';

function App() {
  return (
    <>
      <Navbar />
      <Toaster position="top-center" theme="dark" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MovieDetailPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;