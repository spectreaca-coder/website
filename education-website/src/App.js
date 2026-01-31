// Initializing App
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Location from './components/Location/Location';
import InquiryPage from './components/InquiryPage';
import LoginPage from './components/LoginPage';
import Footer from './components/Footer';
import HomePageV2 from './components/HomePageV2';
import HomePageV3 from './components/HomePageV3';
import InstructorsV3 from './components/InstructorsV3';
import CurriculumV3 from './components/CurriculumV3';
import NoticesV3 from './components/NoticesV3';
import CourseRegistrationV3 from './components/CourseRegistrationV3';
import LocationV3 from './components/LocationV3';
import HeroImageManager from './components/HeroImageManager';
import InstructorsV2 from './components/InstructorsV2';
import CurriculumV2 from './components/CurriculumV2';
import CourseRegistrationV2 from './components/CourseRegistrationV2';
import NoticesV2 from './components/NoticesV2';
import './App.css';

function AppContent() {
  const location = useLocation();

  const isV2 = location.pathname.startsWith('/v2') ||
    location.pathname === '/' ||
    location.pathname === '/instructors' ||
    location.pathname === '/curriculum' ||
    location.pathname === '/notices' ||
    location.pathname === '/register';
  const isV3 = location.pathname.startsWith('/v3');

  return (
    <div className="App">
      {!isV2 && !isV3 && <Header />}
      <Routes>
        {/* Main Routes - Now using V2 Components */}
        <Route path="/" element={<HomePageV2 />} />
        <Route path="/instructors" element={<InstructorsV2 />} />
        <Route path="/curriculum" element={<CurriculumV2 />} />
        <Route path="/notices" element={<NoticesV2 />} />
        <Route path="/register" element={<CourseRegistrationV2 />} />
        <Route path="/location" element={<Location />} /> {/* Keep Location if V2 doesn't have specific one, or use LocationV3 if compatible? V2 didn't seem to have LocationV2. Location.js is likely fine. */}

        {/* Admin Routes */}
        <Route path="/admin/hero-images" element={<HeroImageManager />} />

        {/* Catch-all Route for V3 */}
        <Route path="/v3/*" element={<HomePageV3 />} />

        {/* Legacy/Other Routes */}
        <Route path="/intro" element={<HomePageV2 />} />
        <Route path="/review" element={<HomePageV2 />} />
        <Route path="/inquiry" element={<InquiryPage />} />
        <Route path="/my-classes" element={<CurriculumV2 />} /> {/* Redirect old link to V2 Curriculum */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<LoginPage />} />

        {/* V3 Routes (Kept for reference, but hidden from main flow) */}
        <Route path="/v3" element={<HomePageV3 />} />
        <Route path="/v3/instructors" element={<InstructorsV3 />} />
        <Route path="/v3/curriculum" element={<CurriculumV3 />} />
        <Route path="/v3/notices" element={<NoticesV3 />} />
        <Route path="/v3/location" element={<LocationV3 />} />
        <Route path="/v3/register" element={<CourseRegistrationV3 />} />

        {/* Explicit V2 Routes (Can be kept or redirected) */}
        <Route path="/v2" element={<HomePageV2 />} />
        <Route path="/v2/instructors" element={<InstructorsV2 />} />
        <Route path="/v2/curriculum" element={<CurriculumV2 />} />
        <Route path="/v2/notices" element={<NoticesV2 />} />
        <Route path="/v2/register" element={<CourseRegistrationV2 />} />
      </Routes>
      {!isV2 && !isV3 && <Footer />}
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
