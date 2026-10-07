import React, { useState, useEffect } from 'react'
import { FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { signInStart, signInSuccess, signInFailure } from '../../redux/slices/userSlice.js'
import toast from 'react-hot-toast';

function SignIn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const { loading, error: errorMessage } = useSelector(state => state.user);

    // Circular Stepped Animation State
    const [ringIndex, setRingIndex] = useState(0);
    const ringAssets = [
        "/SR1.png",
        "/SR2.png",
        "/SR3.png",
        "/SR4.png",
        "/SR5.png",
        "/SR6.png",
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setRingIndex((prev) => (prev + 1) % ringAssets.length);
        }, 5000); // Wait 5 seconds then step
        return () => clearInterval(interval);
    }, [ringAssets.length]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() })
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            return dispatch(signInFailure('Please fill the required details'));
        }
        try {
            dispatch(signInStart());
            const res = await fetch(`${import.meta.env.VITE_PORT}/api/auth/signin`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(signInFailure(data.message));
                toast.error(data.message);
            }
            if (res.ok) {
                dispatch(signInSuccess(data));
                localStorage.setItem("token", data.token);
                toast.success("Login Successful");
                navigate('/');
            }
        } catch (error) {
            dispatch(signInFailure(error.message));
            toast.error(error.message);
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-hidden uppercase">
            <div className="relative w-full max-w-5xl h-[min(90vh,750px)] bg-white rounded-lg shadow-2xl flex overflow-hidden">

                {/* Close Button */}
                <Link to="/" className="absolute top-6 right-6 z-50 text-gray-400 hover:text-black transition-colors bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm">
                    <FaTimes className="h-5 w-5" />
                </Link>

                {/* Left Section: White Background with Right-Bulging Black Circle */}
                <div className="hidden lg:flex relative w-[45%] h-full bg-white overflow-hidden group">
                    {/* Main White Background */}
                    <div className="absolute inset-0 bg-white"></div>

                    {/* Large Black Circle bulging RIGHT into the white area */}
                    <div className="absolute top-1/2 right-[100%] -translate-y-1/2 translate-x-[45%] w-[180%] aspect-square bg-[#1b1b1b] rounded-full"></div>

                    {/* Circular Gallery Area */}
                    <div className="absolute inset-0 flex items-center justify-start pl-10 pointer-events-none">
                        <div className="relative flex items-center justify-center">
                            {ringAssets.map((img, i) => {
                                let diff = i - ringIndex;
                                if (diff > 3) diff -= ringAssets.length;
                                if (diff < -2) diff += ringAssets.length;

                                // Circular path matching the right-bulging arc
                                const radius = 520;
                                const theta = (diff * 21) * (Math.PI / 125); // ~30 degrees per ring step
                                const ty = -radius * Math.sin(theta);
                                // Bulge RIGHT (Center is right of ends)
                                const tx = -(radius - radius * Math.cos(theta)) + 320;

                                // Only show 3 rings at a time to prevent wrap-around slides
                                const isVisible = Math.abs(diff) <= 1;

                                return (
                                    <div
                                        key={i}
                                        className={`absolute transition-all duration-[1500ms] ease-in-out ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
                                        style={{
                                            transform: `translate(${tx}px, ${ty}px) scale(${diff === 0 ? 1.4 : Math.abs(diff) === 1 ? 0.8 : 0.55})`,
                                            zIndex: 10 - Math.abs(diff),
                                            filter: `blur(${Math.abs(diff) * 2}px) brightness(${1 - Math.abs(diff) * 0.4})`
                                        }}
                                    >
                                        <div className="w-64 h-64 flex items-center justify-center p-4">
                                            <img
                                                src={img}
                                                alt={`Jewellery ${i}`}
                                                className="w-full h-full object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-pulse-slow"
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Right Section: Form */}
                <div className="w-full lg:w-[55%] h-full flex flex-col items-center justify-center p-8 md:p-16 overflow-y-auto bg-white">
                    <div className="w-full max-w-sm space-y-10">
                        {/* Logo & Header */}
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl md:text-4xl font-serif tracking-[0.3em] uppercase text-black">SilverWale</h2>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="relative group">
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2 transition-colors group-focus-within:text-black">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    placeholder="Enter your email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full border border-gray-200 px-4 py-4 text-xs bg-transparent focus:border-black outline-none transition-all placeholder:text-gray-300 rounded-sm"
                                />
                            </div>

                            <div className="relative group">
                                <label className="block text-[9px] font-bold uppercase tracking-widest text-gray-400 mb-2 transition-colors group-focus-within:text-black">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 px-4 py-4 text-xs bg-transparent focus:border-black outline-none transition-all placeholder:text-gray-300 rounded-sm pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
                                    >
                                        {showPassword ? <FaEye className="h-4 w-4" /> : <FaEyeSlash className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-black text-white py-4 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-all shadow-md active:scale-[0.98] disabled:bg-gray-300"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Continue'}
                            </button>
                        </form>

                        {/* Footer Links & Consent */}
                        <div className="space-y-6 pt-4">
                            <p className="text-[9px] text-gray-500 tracking-wide leading-relaxed">
                                By continuing, I agree to <Link to="/terms" className="text-black font-bold underline">T&C</Link> & <Link to="/privacy" className="text-black font-bold underline">Privacy Policy</Link>
                            </p>

                            <label className="flex items-start space-x-3 cursor-pointer group">
                                <input type="checkbox" className="mt-0.5 rounded border-gray-300 text-black focus:ring-0 h-3 w-3" />
                                <span className="text-[9px] text-gray-500 tracking-wide group-hover:text-black transition-colors">
                                    Subscribe for exclusive offers from SilverWale
                                </span>
                            </label>
                        </div>

                        {/* Create Account Link */}
                        <div className="pt-8 text-center border-t border-gray-100">
                            <p className="text-[9px] font-bold tracking-[0.1em] text-gray-400 uppercase">
                                New to SilverWale?
                                <Link to="/signup" className="ml-2 text-black border-b border-black hover:pb-1 transition-all">Create Account</Link>
                            </p>
                        </div>

                        {errorMessage && (
                            <div className="bg-red-50 text-red-600 p-4 text-[9px] font-bold border border-red-100 uppercase tracking-widest text-center">
                                {errorMessage}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 3s ease-in-out infinite;
                }
            `}} />
        </div>
    )
}

export default SignIn