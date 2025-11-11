import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import Instructors from './components/Instructors/Instructors';
import Location from './components/Location/Location';
import CourseRegistration from './components/CourseRegistration';
import InquiryPage from './components/InquiryPage';
import LoginPage from './components/LoginPage';
import MyClasses from './components/MyClasses';
import Footer from './components/Footer';
import './App.css';

// A wrapper component to use the useLocation hook
const AppContent = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <div className="App">
      <Header />
      <main className={`app-main ${isHomePage ? 'home-main' : ''}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/instructors" element={<Instructors />} />
          <Route path="/location" element={<Location />} />
          <Route path="/register" element={<CourseRegistration />} />
          <Route path="/notices" element={<InquiryPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/my-classes" element={<MyClasses />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
