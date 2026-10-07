import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { FaBalanceScale, FaUserCheck, FaCopyright, FaExclamationTriangle, FaGavel, FaHome } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Terms = () => {
    const sections = [
        {
            icon: <FaUserCheck />,
            title: "1. Use of the Service",
            content: "You must be at least 18 years old to use the Service. By using the Service, you represent and warrant that you are at least 18 years old and have the legal capacity to enter into these Terms and Conditions."
        },
        {
            icon: <FaBalanceScale />,
            title: "2. User Account",
            content: "You may be required to create an account to access certain features. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account."
        },
        {
            icon: <FaCopyright />,
            title: "3. Intellectual Property",
            content: "The Service and its original content, features, and functionality are owned by SilverWale and are protected by international copyright, trademark, and other intellectual property laws."
        },
        {
            icon: <FaExclamationTriangle />,
            title: "4. Limitation of Liability",
            content: "To the fullest extent permitted by law, SilverWale shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of the Service."
        },
        {
            icon: <FaGavel />,
            title: "5. Governing Law",
            content: "These Terms and Conditions shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Ahmedabad, India."
        }
    ];

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
                        <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-bold block">User Agreement</span>
                        <h1 className="text-5xl font-serif italic text-gray-900 leading-tight">
                            Terms & Conditions
                        </h1>
                        <p className="text-gray-500 font-light max-w-xl mx-auto italic leading-relaxed">
                            Welcome to SilverWale. Please read these terms carefully before using our services.
                        </p>
                    </div>

                    <div className="prose prose-gray max-w-none">
                        <div className="bg-gray-50 p-10 rounded-sm border border-gray-100 mb-16 text-gray-600 font-light leading-relaxed italic">
                            By accessing and using SilverWale (the "Service"), you agree to be bound by these Terms and Conditions. Your use of the Service constitutes your acceptance of these terms.
                        </div>

                        <div className="space-y-16">
                            {sections.map((section, idx) => (
                                <div key={idx} className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="bg-white border border-gray-100 p-4 rounded-full text-gray-400 shadow-sm">
                                        <div className="text-xl">{section.icon}</div>
                                    </div>
                                    <div className="space-y-4">
                                        <h2 className="text-2xl font-medium tracking-tight text-gray-900">{section.title}</h2>
                                        <p className="text-gray-500 font-light leading-relaxed">
                                            {section.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-32 pt-16 border-t border-gray-100 text-center space-y-8">
                        <div className="max-w-xl mx-auto">
                            <h3 className="text-xl font-medium text-gray-900 mb-4">Any clarifications needed?</h3>
                            <p className="text-gray-500 font-light italic leading-relaxed">
                                We believe in transparency. If you have any questions about these terms, please don't hesitate to reach out.
                            </p>
                        </div>
                        <a 
                            href="mailto:silverwale025@gmail.com?subject=Terms & Conditions Query&body=Hello,"
                            onClick={() => {
                                toast.success("Opening mail client... Or contact us at silverwale025@gmail.com");
                            }}
                            className="inline-block bg-black text-white px-12 py-4 uppercase tracking-[0.2em] font-bold text-[10px] hover:bg-gray-900 transition-all rounded-sm shadow-xl"
                        >
                            Contact Legal Team
                        </a>
                    </div>
                </div>
            </main>

            <FloatingWhatsApp />
            <Footer />
        </div>
    );
};

export default Terms;
