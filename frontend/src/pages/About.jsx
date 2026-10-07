import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { FaGem, FaHandHoldingHeart, FaAward, FaUsers, FaHome } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <nav className="max-w-7xl mx-auto w-full px-4 py-8 flex items-center relative border-b border-gray-50">
        <Link to="/" className="text-gray-400 hover:text-black transition-colors">
          <FaHome className="h-6 w-6" />
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="text-2xl font-serif tracking-[0.2em] uppercase text-black">
            SilverWale
          </Link>
        </div>
      </nav>
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-24 bg-gray-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
            <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-bold mb-4 block">Our Story</span>
            <h1 className="text-5xl md:text-7xl font-serif italic text-gray-900 mb-8 leading-tight">
              Crafting Elegance,<br />Defining Moments
            </h1>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg font-light leading-relaxed">
              SilverWale was born from a passion for timeless beauty and the belief that every person deserves to shine with authentic, high-quality jewelry.
            </p>
          </div>
          <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-5 pointer-events-none">
            <FaGem className="text-[400px]" />
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="max-w-7xl mx-auto px-4 py-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl font-medium tracking-tight text-gray-900">Our Mission</h2>
              <div className="space-y-6 text-gray-600 font-light leading-relaxed italic border-l-2 border-black pl-8">
                <p className="text-xl">
                  "To inspire and empower individuals to achieve their style goals by offering top-notch pieces at affordable prices."
                </p>
              </div>
              <p className="text-gray-500 leading-relaxed">
                At SilverWale, we believe in the power of beautiful jewellery to bring people together, foster confidence, and promote a stylish lifestyle. Whether you're looking for something elegant or just starting your collection, we have everything you need to shine.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] bg-gray-100 overflow-hidden rounded-sm shadow-2xl">
                <img 
                  src="/ring_showcase_1.jpeg" 
                  alt="Craftsmanship" 
                  className="w-full h-full object-cover mix-blend-multiply opacity-80"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-black text-white p-12 max-w-xs hidden md:block shadow-2xl">
                <p className="text-2xl font-serif italic opacity-90">"Quality is not an act, it is a habit."</p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="bg-gray-900 py-24 text-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              {[
                { icon: <FaGem />, title: "Premium Quality", desc: "Sourced from trusted manufacturers." },
                { icon: <FaHandHoldingHeart />, title: "Affordability", desc: "Luxury accessible to everyone." },
                { icon: <FaAward />, title: "Authenticity", desc: "Every piece is BIS Hallmarked." },
                { icon: <FaUsers />, title: "Community", desc: "Fostering confidence through style." }
              ].map((value, idx) => (
                <div key={idx} className="text-center space-y-4">
                  <div className="text-3xl mb-6 flex justify-center text-gray-400">{value.icon}</div>
                  <h3 className="text-lg font-medium tracking-wide uppercase text-[12px] opacity-90">{value.title}</h3>
                  <p className="text-gray-400 text-sm font-light leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Closing Note */}
        <section className="max-w-3xl mx-auto px-4 py-32 text-center space-y-8">
          <p className="text-gray-600 font-light text-xl leading-relaxed italic">
            Thank you for choosing SilverWale as your partner in achieving your style dreams. We look forward to serving you and being a part of your fashion adventures.
          </p>
          <div className="h-px w-24 bg-black mx-auto opacity-20"></div>
          <p className="text-sm tracking-[0.3em] uppercase font-bold text-black">SilverWale Jewellery</p>
        </section>
      </main>

      <FloatingWhatsApp />
      <Footer />
    </div>
  );
};

export default About;
