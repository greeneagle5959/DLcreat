import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Components
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Hero from './components/Hero/Hero';
import Events from './components/Events/Events';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import About from './pages/About';
import Profile from './pages/Profile';
import CreateEvent from './pages/CreateEvent';
import Admin from './pages/Admin';
import EditProfile from './pages/EditProfile';
import EventDetail from './pages/EventDetail';

function HomePage() {
  return (
    <main className="app-main">
      <Hero />
      <Events />
    </main>
  );
}

function App() {
  return (
    <Router>
      <div className="app">
        <Header />

        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/about" element={<About />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/event/:id" element={<EventDetail />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
