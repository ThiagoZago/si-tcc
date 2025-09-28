// import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import {ToastContainer} from "react-toastify";

import NavBar from './components/layout/NavBar/NavBar';
import Footer from './components/layout/Footer/Footer';
import Container from './components/layout/Container/Container'

import Home from './components/pages/Home';
import About from './components/pages/About';
import Help from './components/pages/Help';
import Schedule from './components/pages/Schedule';
import Access from './components/pages/Access';
import News from './components/pages/News';
import Developers from './components/pages/Developers';
import UserPage from './components/pages/userPage/UserPage';
import Register from './components/pages/Register';
import RegisterBusiness from './components/pages/registerBusiness/RegisterBusiness'

import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <Router>
      <ScrollToTop />
      <NavBar />
      <Container>
        <Routes>
          <Route path="/" exact element={<Home />} />
          <Route path="/sobre-nos" element={<About />} />
          <Route path="/ajuda" element={<Help />}/>
          <Route path="/agendar" element={<Schedule />}/>
          <Route path="/acesso" element={<Access />}/>
          <Route path="/novidades" element={<News />} />
          <Route path="/desenvolvedores" element={<Developers />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/inicio" element={<UserPage/>} />
          </Route>
          <Route path="/registro" element={<Register />}></Route>
          <Route path="/configuracao-empresa" element={<RegisterBusiness />}></Route>
        </Routes>
        <ToastContainer />
      </Container>
      <Footer />
    </Router>
  );
}

export default App;
