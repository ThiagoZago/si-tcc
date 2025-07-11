import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';
import Container from './components/layout/Container';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './components/pages/Home';
import About from './components/pages/About';
import Help from './components/pages/Help';
import Schedule from './components/pages/Schedule';
import Access from './components/pages/Access';
import News from './components/pages/News';
import Developers from './components/pages/Developers';
import UserPage from './components/pages/UserPage';
import Register from './components/pages/Register';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <NavBar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sobre-nos" element={<About />} />
          <Route path="/ajuda" element={<Help />} />
          <Route path="/agendar" element={<Schedule />} />
          <Route path="/acesso" element={<Access />} />
          <Route path="/novidades" element={<News />} />
          <Route path="/desenvolvedores" element={<Developers />} />
          <Route path="/registro" element={<Register />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/inicio" element={<UserPage />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;