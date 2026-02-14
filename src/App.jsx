import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PainPoints from './components/PainPoints';
import Services from './components/Services';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import About from './components/About';
import CTA from './components/CTA';
import Footer from './components/Footer';
import MobileCallButton from './components/MobileCallButton';
import PrivacyPolicy from './components/PrivacyPolicy';

function HomePage() {
  return (
    <>
      <Hero />
      <PainPoints />
      <Services />
      <Process />
      <Testimonials />
      <About />
      <CTA />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
        <Footer />
        <MobileCallButton />
      </div>
    </BrowserRouter>
  );
}
