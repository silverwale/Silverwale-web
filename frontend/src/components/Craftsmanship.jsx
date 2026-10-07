import React from 'react';
import { Cloudinary } from '@cloudinary/url-gen';
import { AdvancedVideo } from '@cloudinary/react';

// Setup Cloudinary instance with your cloud name
const cld = new Cloudinary({
  cloud: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  }
});

const Craftsmanship = () => {
    // Reference video by its Cloudinary public ID
    // Note: ensure this matches exactly what's uploaded (usually without the .mp4 extension)
    const myVideo = cld.video('SilverWale_expert_craftmenship_final_gxtzig');

    return (
        <section className="w-full bg-[#f9f9f9] overflow-hidden">
            <div className="flex flex-col md:flex-row min-h-[400px] md:h-[500px]">
                {/* Left Section: Video */}
                <div className="w-full md:w-1/2 relative bg-black">
                    <AdvancedVideo 
                        cldVid={myVideo}
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        className="w-full h-full object-cover opacity-90"
                    />
                </div>

                {/* Right Section: Content */}
                <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 lg:p-24 bg-[#f9f9f9]">
                    <div className="text-evenly max-w-lg space-y-6">
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif tracking-widest text-gray-800 leading-tight">
                            Exceptional Craftsmanship, Handcrafted with Heart & Heritage
                        </h2>
                        
                        <div className="space-y-4">
                            <p className="text-xs md:text-sm font-medium tracking-[0.3em] text-gray-600 uppercase">
                                by Master Indian Artisans
                            </p>
                            
                            <p className="text-sm md:text-base font-light leading-relaxed text-gray-500 tracking-wide">
                                Your vision inspires our craft — from sketch to sparkle, every jewel is crafted with precision to bring dreams alive!
                            </p>
                        </div>

                        <div className="pt-4">
                            <span className="text-[10px] md:text-xs font-serif italic tracking-widest text-gray-400">
                                — SilverWale
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Craftsmanship;
