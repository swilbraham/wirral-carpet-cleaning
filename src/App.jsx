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

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <PainPoints />
      <Services />
      <Process />
      <Testimonials />
      <About />
      <CTA />
      <Footer />
      <MobileCallButton />
    </div>
  );
}
