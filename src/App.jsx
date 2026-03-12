import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
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
import SpinWheel from './components/SpinWheel';
import CarpetGame from './components/CarpetGame';

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }, [location.hash]);

  return (
    <>
      <Helmet>
        <title>Wirral Carpet Cleaning | Domestic & Commercial Carpet, Upholstery & Biohazard Cleaning in Merseyside & Cheshire</title>
        <meta name="description" content="Domestic & commercial carpet cleaning, sofa & upholstery cleaning and biohazard cleaning across Wirral, Liverpool, Birkenhead, Prenton, Chester & Merseyside. 15+ years experience, fully insured, eco-friendly. Free quotes — call 0151 936 9664." />
        <link rel="canonical" href="https://www.wirralcarpetcleaning.com/" />
      </Helmet>
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
        <Route path="/spin-wheel" element={<SpinWheel />} />
        <Route path="/game" element={<CarpetGame />} />
        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </BrowserRouter>
  );
}
