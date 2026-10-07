import React from 'react';
import { FaCertificate, FaGem, FaRedo, FaShieldAlt } from 'react-icons/fa';

const KGNAssurance = () => {
    const assurances = [
        {
            icon: <FaShieldAlt className="w-5 h-5 md:w-6 md:h-6" />,
            title: "BIS Hallmark",
            description: "100% Hallmarked Jewellery"
        },
        {
            icon: <FaRedo className="w-5 h-5 md:w-6 md:h-6" />,
            title: "15-Day Returns",
            description: "No questions asked returns"
        },
        {
            icon: <FaCertificate className="w-5 h-5 md:w-6 md:h-6" />,
            title: "SilverWale Certified",
            description: "Authenticity guaranteed"
        },
        {
            icon: <FaGem className="w-5 h-5 md:w-6 md:h-6" />,
            title: "Lifetime Exchange",
            description: "& Buyback on all orders"
        }
    ];

    return (
        <section className='w-full py-12 md:py-20 px-4 bg-white border-y border-gray-50'>
            <div className='max-w-7xl mx-auto'>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-4'>
                    {assurances.map((assurance, index) => (
                        <div key={index} className='flex flex-col items-center text-center px-2 group'>
                            <div className='mb-4 md:mb-6 w-12 h-12 md:w-16 md:h-16 bg-[#f9f9f9] rounded-full flex items-center justify-center text-gray-400 group-hover:text-black group-hover:bg-gray-100 transition-all duration-500'>
                                {assurance.icon}
                            </div>
                            <h3 className='text-[10px] md:text-xs font-bold tracking-[0.15em] text-black uppercase mb-1 md:mb-2'>
                                {assurance.title}
                            </h3>
                            <p className='text-gray-400 text-[8px] md:text-[10px] leading-relaxed font-medium uppercase tracking-widest max-w-[120px]'>
                                {assurance.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default KGNAssurance;
