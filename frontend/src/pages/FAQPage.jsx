import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import { FaPlus, FaMinus, FaQuestionCircle, FaShieldAlt, FaTruck, FaEnvelope, FaHome } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const FaqPage = () => {
    const [openIndex, setOpenIndex] = useState(0);

    const faqs = [
        {
            icon: <FaQuestionCircle />,
            question: "How do I sign in to SilverWale?",
            answer: "To sign in to SilverWale, simply click on the \"Sign In\" button on the header. You can create an account using your email or sign in if you already have one."
        },
        {
            icon: <FaShieldAlt />,
            question: "Is my personal information safe with SilverWale?",
            answer: "Yes, we take the security and privacy of your personal information very seriously. We use secure encryption and industry-standard practices to protect your data."
        },
        {
            icon: <FaShieldAlt />,
            question: "What is the SilverWale assurance?",
            answer: "Every piece from SilverWale is BIS Hallmarked and comes with a certificate of authenticity. We ensure the highest quality standards for our silver and diamond jewellery."
        },
        {
            icon: <FaTruck />,
            question: "How do I track my order?",
            answer: "You can track your order by visiting the \"My Orders\" section in your profile dashboard. You will also receive email notifications with tracking details once your order is shipped."
        },
        {
            icon: <FaEnvelope />,
            question: "What should I do if I encounter any issues?",
            answer: "If you encounter any issues, please reach out to our support team at silverwale025@gmail.com. We'll be happy to assist you and resolve any problems you may be experiencing."
        }
    ];

    return (
        <div className="bg-white min-h-screen flex flex-col focus:outline-none">
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
                        <span className="text-[10px] tracking-[0.4em] uppercase text-gray-400 font-bold block">Support Center</span>
                        <h1 className="text-5xl font-serif italic text-gray-900 leading-tight">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-gray-500 font-light max-w-xl mx-auto italic leading-relaxed">
                            Find answers to common questions about our products, services, and policies.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <div 
                                key={index} 
                                className={`group border rounded-sm transition-all duration-300 ${openIndex === index ? 'border-black bg-gray-50 shadow-lg shadow-gray-100' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                            >
                                <button 
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                    className="w-full flex justify-between items-center px-8 py-7 text-left"
                                >
                                    <div className="flex items-center space-x-6">
                                        <div className={`text-xl transition-colors duration-300 ${openIndex === index ? 'text-black' : 'text-gray-400 group-hover:text-gray-600'}`}>
                                            {faq.icon}
                                        </div>
                                        <span className={`text-lg font-medium transition-colors duration-300 ${openIndex === index ? 'text-black' : 'text-gray-700'}`}>
                                            {faq.question}
                                        </span>
                                    </div>
                                    <div className={`transition-transform duration-500 ${openIndex === index ? 'rotate-180 text-black' : 'text-gray-300 group-hover:text-gray-400'}`}>
                                        {openIndex === index ? <FaMinus className="h-3 w-3" /> : <FaPlus className="h-3 w-3" />}
                                    </div>
                                </button>
                                
                                {openIndex === index && (
                                    <div className="px-8 pb-8 animate-fadeIn">
                                        <div className="pl-14 text-gray-500 font-light leading-relaxed leading-relaxed max-w-2xl">
                                            {faq.answer}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-24 bg-[#f8f9fa] p-12 text-center rounded-sm border border-gray-100">
                        <h3 className="text-xl font-medium text-gray-900 mb-4">Still have questions?</h3>
                        <p className="text-gray-500 font-light mb-8 italic">We're here to help you 24/7. Connect with us on WhatsApp or Email.</p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <a 
                                href="mailto:silverwale025@gmail.com?subject=Enquiry from SilverWale FAQ&body=Hello SilverWale team,"
                                onClick={() => {
                                    toast.success("Opening mail client... Or contact us at silverwale025@gmail.com");
                                }}
                                className="bg-white border border-black text-black px-8 py-3 uppercase tracking-widest font-bold text-[10px] hover:bg-black hover:text-white transition-all rounded-sm shadow-sm flex items-center justify-center"
                            >
                                Email Support
                            </a>
                            <a 
                                href="https://wa.me/919924559125"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-black text-white px-8 py-3 uppercase tracking-widest font-bold text-[10px] hover:bg-gray-900 transition-all rounded-sm shadow-xl"
                            >
                                WhatsApp Chat
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

export default FaqPage;
