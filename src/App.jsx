import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import PainPoints from './components/PainPoints';
import Services from './components/Services';
import Process from './components/Process';
import Testimonials from './components/Testimonials';
import About from './components/About';
import CostCalculator from './components/CostCalculator';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Footer from './components/Footer';
import MobileCallButton from './components/MobileCallButton';
import PrivacyPolicy from './components/PrivacyPolicy';
import Landing from './components/Landing';

function HomePage() {
  return (
    <>
      <Hero />
      <PainPoints />
      <Services />
      <Process />
      <CostCalculator />
      <Testimonials />
      <About />
      <FAQ />
      <CTA />
    </>
  );
}

function MainLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
      <Footer />
      <MobileCallButton />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/landing" element={<Landing />} />
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
