import React from 'react';
import { Link } from 'react-router-dom';

const GiftSection = () => {
    const gifts = [
        {
            title: 'Solitaire Jewellery',
            image: '/ring_6.png', // Using available assets that look premium
            link: '/category/ring'
        },
        {
            title: 'Initials Jewellery',
            image: '/chain_1.png',
            link: '/category/necklace'
        },
        {
            title: 'Heart Jewellery',
            image: '/pendant_1.png',
            link: '/category/necklace'
        },
        {
            title: 'Smart Watch Charm',
            image: '/ring_showcase_1.jpeg',
            link: '/explore'
        }
    ];

    return (
        <section className="w-full py-16 md:py-24 bg-white">
            <div className="max-w-6xl mx-auto px-4">
                <Link to="/explore" className="block text-center mb-12 group">
                    <h2 className="text-xl md:text-2xl font-serif tracking-[0.2em] text-gray-800 uppercase inline-block border-b border-transparent group-hover:border-black transition-all">
                        Gifts That Say It All
                    </h2>
                </Link>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
                    {gifts.map((gift, index) => (
                        <Link 
                            key={index} 
                            to={gift.link}
                            className="group flex flex-col shadow-sm overflow-hidden"
                        >
                            <div className="aspect-[4/5] w-full bg-[#f9f9f9] p-4 md:p-10 flex items-center justify-center overflow-hidden transition-all duration-500 group-hover:bg-[#f0f0f0]">
                                <img 
                                    src={gift.image} 
                                    alt={gift.title}
                                    className="max-h-full max-w-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-1000"
                                    onError={(e) => { e.target.src = '/ring_1.jpeg'; }}
                                />
                            </div>
                            <div className="w-full bg-[#8E8D8D] py-3 text-center">
                                <span className="text-white text-[9px] md:text-[11px] font-medium tracking-[0.2em] uppercase">
                                    {gift.title}
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link 
                        to="/explore"
                        className="inline-block border border-black px-12 py-3 text-[10px] md:text-[11px] tracking-[0.3em] font-medium text-black uppercase hover:bg-black hover:text-white transition-all"
                    >
                        Explore All Gifts
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default GiftSection;
