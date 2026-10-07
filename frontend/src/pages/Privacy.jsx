import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { FaShieldAlt, FaLock, FaUserShield, FaEye, FaSync, FaHome } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Privacy = () => {
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
      
      <main className="flex-grow pt-24 pb-32">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-20 space-y-4">
            <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-bold block">Legal Information</span>
            <h1 className="text-5xl font-serif italic text-gray-900 leading-tight">
              Privacy Policy
            </h1>
            <p className="text-gray-500 font-light max-w-xl mx-auto italic leading-relaxed">
              Last updated: March 2026. Your privacy and data security are our top priorities.
            </p>
          </div>

          <div className="bg-gray-50 p-12 rounded-sm border border-gray-100 mb-16">
            <div className="flex items-start space-x-6">
                <div className="bg-black text-white p-4 rounded-full mt-1">
                    <FaShieldAlt className="h-6 w-6" />
                </div>
                <div className="space-y-4">
                    <h2 className="text-2xl font-medium text-gray-900">Commitment to Privacy</h2>
                    <p className="text-gray-600 font-light leading-relaxed">
                        At SilverWale, we are committed to protecting the privacy and security of our users' personal information. This Privacy Policy outlines how we collect, use, and safeguard the information you provide to us when using our website and services.
                    </p>
                </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {[
              {
                icon: <FaUserShield />,
                title: "Information We Collect",
                content: "When you interact with SilverWale, we collect basic profile information including your name and email address. We also collect information related to your activity on our platform, such as the jewellery pieces you browse or purchase."
              },
              {
                icon: <FaEye />,
                title: "How We Use Information",
                content: "We use the information we collect to provide and improve our services, personalize your experience, communicate with you, and analyze trends and user behavior on our platform."
              },
              {
                icon: <FaLock />,
                title: "Data Security",
                content: "We take appropriate measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. We use industry-standard security technologies and procedures."
              },
              {
                icon: <FaSync />,
                title: "Updates & Changes",
                content: "We may update this Privacy Policy from time to time. We encourage you to review this Privacy Policy periodically for any updates or changes to ensure you stay informed."
              }
            ].map((section, idx) => (
              <div key={idx} className="space-y-6 p-8 border border-gray-100 rounded-sm hover:border-gray-200 transition-colors">
                <div className="text-2xl text-gray-400">{section.icon}</div>
                <h3 className="text-xl font-medium text-gray-900">{section.title}</h3>
                <p className="text-gray-500 font-light leading-relaxed text-sm">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-20 pt-16 border-t border-gray-100">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                <div className="space-y-4 text-center md:text-left">
                    <h3 className="text-xl font-medium text-gray-900">Questions about your data?</h3>
                    <p className="text-gray-500 font-light italic">Reach out to our Data Privacy Officer for any concerns.</p>
                </div>
                <a 
                    href="mailto:silverwale025@gmail.com?subject=Privacy Policy Query&body=Hello,"
                    onClick={() => {
                        toast.success("Opening mail client... Or contact us at silverwale025@gmail.com");
                    }}
                    className="bg-black text-white px-12 py-4 uppercase tracking-[0.2em] font-bold text-[10px] hover:bg-gray-900 transition-all rounded-sm shadow-xl"
                >
                    Contact Support
                </a>
            </div>
          </div>
        </div>
      </main>

      <FloatingWhatsApp />
      <Footer />
    </div>
  );
};

export default Privacy;
