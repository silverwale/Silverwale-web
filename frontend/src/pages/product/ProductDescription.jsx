import React, { useEffect, useState } from 'react';
import ImageDescription from '../../components/ImageDescription';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import FloatingWhatsApp from '../../components/FloatingWhatsApp';
import { useDispatch, useSelector } from 'react-redux';
import { getProductByIdFailure, getProductByIdStart, getProductByIdSuccess } from '../../redux/slices/productSlice';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    addCartItemFailure, addCartItemStart, addCartItemSuccess, addToCartGuest,
    removeCartItemStart, removeCartItemSuccess, removeCartItemFailure, removeFromCartGuest,
    updateCartItemQuantityStart, updateCartItemQuantitySuccess, updateCartItemQuantityFailure, updateQuantityGuest,
    fetchCartItemsSuccess
} from '../../redux/slices/cartSlice';
import { addToWishlist, removeFromWishlist } from '../../redux/slices/wishlistSlice';
import { FaHeart, FaRegHeart, FaStar, FaPercentage, FaExchangeAlt, FaPlus, FaShieldAlt, FaAward, FaThumbsUp, FaCheck } from 'react-icons/fa';
import { HiOutlineArrowPath } from 'react-icons/hi2';
import { IoIosArrowBack, IoIosArrowForward, IoMdClose } from 'react-icons/io';
import { LuRotateCcw } from 'react-icons/lu';
import { BsCheckCircleFill } from 'react-icons/bs';

function ProductDescription() {
    const dispatch = useDispatch();
    const { productId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const { currentUser } = useSelector(state => state.user);
    const { cartItems = [] } = useSelector(state => state.cart);
    const [product, setProduct] = useState(null);
    const { wishlistIds } = useSelector(state => state.wishlist);

    // Local states for selections from mockup

    const [selectedMetal, setSelectedMetal] = useState('SS');
    const [selectedSize, setSelectedSize] = useState('14');
    const [openAddOn, setOpenAddOn] = useState(null);
    const [openDetail, setOpenDetail] = useState('details');
    const [similarProducts, setSimilarProducts] = useState([]);
    const [similarLoading, setSimilarLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('recommended');
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

    // Engraving & Customization states
    const [engravingText, setEngravingText] = useState('');
    const [selectedStone, setSelectedStone] = useState(null);
    const [selectedFinish, setSelectedFinish] = useState('High Polish');
    const [isCustomized, setIsCustomized] = useState(false);

    const stoneOptions = [
        { id: 'zircon', label: 'Diamond White', image: '/assets/gems/diamond.png' },
        { id: 'emerald', label: 'Emerald Green', image: '/assets/gems/emerald.png' },
        { id: 'ruby', label: 'Ruby Red', image: '/assets/gems/ruby.png' },
        { id: 'sapphire', label: 'Sapphire Blue', image: '/assets/gems/sapphire.png' },
        { id: 'citrine', label: 'Citrine Yellow', image: '/assets/gems/citrine.png' },
        { id: 'amethyst', label: 'Amethyst Purple', image: '/assets/gems/amethyst.png' },
        { id: 'pink_sapphire', label: 'Pink Sapphire', image: '/assets/gems/pink_sapphire.png' },
        { id: 'black_onyx', label: 'Black Onyx', image: '/assets/gems/black_onyx.png' }
    ];

    const finishOptions = [
        { id: 'polish', label: 'High Polish', description: 'Mirror-like shine' }
    ];

    const isWishlisted = (id) => wishlistIds?.includes(id);

    const metalOptions = [
        { id: 'SS', label: '925 Silver' },
        { id: 'RS', label: 'Rose Silver' },
        { id: 'YS', label: 'Yellow Silver' }
    ];

    const RING_SIZES = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22'];
    const BANGLE_SIZES = ['2/0', '2/1', '2/2', '2/3', '2/4', '2/5', '2/6', '2/7', '2/8', '2/9', '2/10'];

    const categoryLower = product?.categoryName?.toLowerCase() || '';
    const isRing = categoryLower.includes('ring');
    const isBangle = categoryLower.includes('bangle') || categoryLower.includes('bracelet');

    const sizes = isBangle ? BANGLE_SIZES : (isRing ? RING_SIZES : []);

    useEffect(() => {
        if (product) {
            if (isBangle) setSelectedSize('2/4');
            else if (isRing) setSelectedSize('14');
            else if (sizes.length > 0) setSelectedSize(sizes[0]);
            else setSelectedSize('');
        }
    }, [product, isRing, isBangle]);

    const currentCartItem = Array.isArray(cartItems) 
        ? cartItems.find(item => 
            item.product?._id === productId && 
            (item.size === selectedSize || (!item.size && !selectedSize)) &&
            (item.metalType === selectedMetal || (!item.metalType && !selectedMetal))
        ) 
        : null;
    const currentQuantity = currentCartItem ? currentCartItem.quantity : 0;

    const scrollRef = React.useRef(null);
    const scrollSizes = (direction) => {
        if (scrollRef.current) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const handleWishlistClick = (id) => {
        if (!currentUser) {
            toast.error("Please login to add to wishlist");
            return;
        }
        if (isWishlisted(id)) {
            dispatch(removeFromWishlist(id));
            toast.success("Removed from wishlist");
        } else {
            dispatch(addToWishlist(id));
            toast.success("Added to wishlist");
        }
    };

    useEffect(() => {
        fetchProduct(productId);
    }, [productId, currentUser]);

    const fetchProduct = async (id) => {
        try {
            dispatch(getProductByIdStart());
            const response = await fetch(`${import.meta.env.VITE_PORT}/api/products/getbyId/${id}`);
            if (!response.ok) throw new Error('Failed to fetch product');
            const data = await response.json();
            dispatch(getProductByIdSuccess(data));
            setProduct(data);
            setLoading(false);
            
            // Fetch similar products based on this product's ID
            fetchSimilarProducts(id);
        } catch (error) {
            dispatch(getProductByIdFailure(error.message));
            setLoading(false);
        }
    };

    const fetchSimilarProducts = async (id) => {
        setSimilarLoading(true);
        try {
            const res = await fetch(`${import.meta.env.VITE_PORT}/api/products/similar/${id}`);
            if (!res.ok) throw new Error('Failed to fetch related products');
            const data = await res.json();
            setSimilarProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Related products fetch error:", err);
        } finally {
            setSimilarLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (currentUser?.userType === 'admin') {
            toast.error('Admins cannot add items to the cart');
            return;
        }

        // Always resolve the effective size & metal so preselected defaults are never null
        const effectiveSize = selectedSize || (isBangle ? '2/4' : isRing ? '14' : sizes.length > 0 ? sizes[0] : null);
        const effectiveMetal = selectedMetal || 'SS';

        if (!currentUser) {
            const customisationData = isCustomized ? {
                engraving: engravingText,
                stone: selectedStone?.label,
                finish: selectedFinish
            } : null;
            dispatch(addToCartGuest({ product, size: effectiveSize, metalType: effectiveMetal, customisation: customisationData }));
            toast.success('Product added to cart');
            return;
        }
        try {
            dispatch(addCartItemStart());
            const customisationData = isCustomized ? {
                engraving: engravingText,
                stone: selectedStone?.label,
                finish: selectedFinish
            } : null;

            const res = await fetch(`${import.meta.env.VITE_PORT}/api/cart/addToCart/${productId}`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    userId: currentUser._id, 
                    size: effectiveSize, 
                    metalType: effectiveMetal,
                    customisation: customisationData
                })
            });
            if (!res.ok) throw new Error('Failed to add to cart');
            // Re-fetch the full cart to ensure consistent data shape
            const cartRes = await fetch(`${import.meta.env.VITE_PORT}/api/cart/getcart/${currentUser._id}`);
            if (cartRes.ok) {
                const cartData = await cartRes.json();
                dispatch(fetchCartItemsSuccess(Array.isArray(cartData) ? cartData : []));
            }
            toast.success('Product added to cart');
        } catch (error) {
            dispatch(addCartItemFailure(error.message));
            toast.error('Could not add to cart');
        }
    };

    const handleDelete = async (itemId) => {
        if (currentUser?.userType === 'admin') {
            toast.error('Admins cannot modify cart');
            return;
        }
        if (!currentUser) {
            dispatch(removeFromCartGuest(itemId));
            toast.success("Removed from cart");
            return;
        }
        dispatch(removeCartItemStart());
        try {
            const res = await fetch(`${import.meta.env.VITE_PORT}/api/cart/delete/${itemId}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error('Failed to delete item');
            dispatch(removeCartItemSuccess(itemId));
            toast.success("Removed from cart");
        } catch (error) {
            dispatch(removeCartItemFailure(error.message));
            toast.error("Error removing item");
        }
    };

    const updateQuantity = async (quantity) => {
        if (currentUser?.userType === 'admin') {
            toast.error('Admins cannot modify cart');
            return;
        }
        if (!currentCartItem) return;
        const cartItemId = currentCartItem.cartItemId;

        if (quantity <= 0) {
            return handleDelete(cartItemId);
        }

        if (!currentUser) {
            dispatch(updateQuantityGuest({ cartItemId, quantity }));
            return;
        }
        dispatch(updateCartItemQuantityStart());
        try {
            const res = await fetch(`${import.meta.env.VITE_PORT}/api/cart/update/${cartItemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quantity }),
            });
            if (!res.ok) throw new Error('Failed to update quantity');
            dispatch(updateCartItemQuantitySuccess({ cartItemId, quantity }));
        } catch (error) {
            dispatch(updateCartItemQuantityFailure(error.message));
            toast.error("Failed to update quantity");
        }
    };

    const handleBuyNow = async () => {
        await handleAddToCart();
        navigate('/cart');
    };

    if (loading) return (
        <>
            <Header />
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
            <Footer />
        </>
    );

    const mrp = product?.price ? Math.round(product.price * 1.05) : 0;

    const deliveryDateObj = new Date();
    deliveryDateObj.setDate(deliveryDateObj.getDate() + 10);
    const weekday = deliveryDateObj.toLocaleDateString('en-GB', { weekday: 'long' });
    const dayMonth = deliveryDateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' });
    const formattedDeliveryDate = `${weekday}, ${dayMonth}`;

    return (
        <div className="bg-white min-h-screen">
            <Header />
            
            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left Side: Images */}
                    <div className="w-full lg:w-3/5">
                        <div className="sticky top-32">
                            <ImageDescription images={product?.image || []} />
                        </div>
                    </div>

                    {/* Right Side: Details */}
                    <div className="w-full lg:w-2/5 space-y-8">
                        {/* Title & Reviews */}
                        <div className="space-y-4">
                            <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold">{product?.categoryName || 'Jewellery'}</p>
                            <h1 className="text-2xl md:text-3xl font-medium tracking-tight text-gray-900 leading-tight">
                                {product?.name}
                            </h1>
                        </div>

                        {/* Price & Offers */}
                        <div className="space-y-4">
                            <div className="flex items-baseline space-x-4">
                                <span className="text-4xl font-bold text-gray-900 tracking-tighter">
                                    ₹{Number(product?.price).toLocaleString('en-IN')}
                                </span>
                                <span className="text-xl text-gray-400 line-through">
                                    ₹{mrp.toLocaleString('en-IN')}
                                </span>
                                <span className="text-xs text-gray-400 font-medium">
                                    (MRP incl. of all taxes)
                                </span>
                            </div>
                            
                            {/* <p className="text-green-700 font-semibold text-sm tracking-wide">
                                Exclusive Offer: Flat 5% Off*
                            </p>

                            <div className="bg-[#FAF5E6] p-4 flex items-center space-x-4 border border-[#F2E8CC] rounded-sm relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-[#E5D5A1]"></div>
                                <div className="bg-black text-white p-1 rounded-full">
                                    <FaPercentage className="text-[10px]" />
                                </div>
                                <p className="text-sm text-gray-800 font-medium tracking-wide">
                                    Use code <span className="font-bold">CELEBRATE</span> for extra 5% off*
                                </p>
                            </div> */}
                        </div>

                        {/* Selection Sections */}
                        <div className="space-y-10 pt-4 border-t border-gray-100">
                            
                            {/* Metal Type */}
                            <div className="space-y-6 pt-4">
                                {/* <div className="flex justify-between items-center">
                                    <h3 className="text-lg text-gray-800 font-medium tracking-tight">Metal Type: <span className="font-light">{metalOptions.find(m => m.id === selectedMetal)?.label || '925 Silver'}</span></h3>
                                    <button className="flex items-center text-[10px] space-x-2 text-gray-500 hover:text-black transition-colors group">
                                        <HiOutlineArrowPath className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                                        <span className="uppercase tracking-widest font-bold">Compare</span>
                                    </button>
                                </div> */}
                                <div className="flex items-center space-x-3">
                                    <button className="p-2 border border-gray-100 rounded-sm text-gray-400"><IoIosArrowBack /></button>
                                    <div className="flex gap-3 overflow-x-auto no-scrollbar">
                                        {metalOptions.map((metal) => (
                                            <div key={metal.id} className="flex flex-col items-center space-y-2 min-w-[64px]">
                                                <button 
                                                    onClick={() => setSelectedMetal(metal.id)}
                                                    className={`w-16 h-16 border rounded-sm p-1 transition-all ${selectedMetal === metal.id ? 'border-black bg-white shadow-md' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}
                                                >
                                                    <div className="h-full w-full rounded-full flex items-center justify-center border border-gray-100 overflow-hidden">
                                                        <div className={`w-full h-full bg-gradient-to-br flex items-center justify-center ${
                                                            metal.id === 'SS' ? 'from-gray-100 via-gray-300 to-gray-500' :
                                                            metal.id === 'RS' ? 'from-rose-100 via-rose-300 to-rose-500' :
                                                            'from-yellow-100 via-yellow-200 to-yellow-400'
                                                        }`}>
                                                            <span className="text-[10px] font-bold text-gray-800 opacity-0">{metal.id}</span>
                                                        </div>
                                                    </div>
                                                </button>
                                                <span className="text-[8px] text-gray-500 uppercase tracking-widest font-medium text-center">{metal.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="p-2 border border-gray-100 rounded-sm text-gray-400"><IoIosArrowForward /></button>
                                </div>
                            </div>

                            {/* Select Size */}
                            {sizes.length > 0 && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg text-gray-800 font-medium tracking-tight">Select Size</h3>
                                        <button 
                                            onClick={() => setIsSizeGuideOpen(true)}
                                            className="text-[10px] uppercase underline underline-offset-4 tracking-[0.2em] font-bold text-gray-800 hover:text-black"
                                        >
                                            Size Guide
                                        </button>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <button 
                                            onClick={() => scrollSizes('left')}
                                            className="p-2 border border-gray-100 rounded-sm text-gray-400 hover:text-black transition-colors"
                                        >
                                            <IoIosArrowBack />
                                        </button>
                                        <div 
                                            ref={scrollRef}
                                            className="flex gap-4 overflow-x-auto custom-scrollbar scroll-smooth pb-4"
                                        >
                                            {sizes.map((size) => (
                                                <button 
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={`w-14 h-14 min-w-[56px] border flex items-center justify-center text-sm transition-all ${selectedSize === size ? 'border-black bg-white text-black font-bold' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'}`}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                        <button 
                                            onClick={() => scrollSizes('right')}
                                            className="p-2 border border-gray-100 rounded-sm text-gray-400 hover:text-black transition-colors"
                                        >
                                            <IoIosArrowForward />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Add Ons */}
                            <div className="space-y-4">
                                <h3 className="text-lg text-gray-800 font-medium tracking-tight">Add Ons:</h3>
                                <div className="space-y-0">
                                    {/* Engraving */}
                                    <div className={`border transition-all duration-300 rounded-sm overflow-hidden mb-2 ${openAddOn === 'engraving' ? 'border-black shadow-lg' : 'border-gray-200'}`}>
                                        <button 
                                            onClick={() => setOpenAddOn(openAddOn === 'engraving' ? null : 'engraving')}
                                            className={`w-full flex justify-between items-center px-6 py-5 hover:bg-gray-50 transition-colors group ${openAddOn === 'engraving' ? 'bg-gray-50' : ''}`}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className="flex flex-col items-start leading-none">
                                                    <span className="text-sm text-gray-700 tracking-wide font-medium">Personalisation & Customisation</span>
                                                    {isCustomized && (
                                                        <span className="text-[9px] text-green-600 font-bold uppercase tracking-widest flex items-center mt-1">
                                                            <BsCheckCircleFill className="mr-1" /> Applied
                                                        </span>
                                                    )}
                                                </div>
                                                <span className="bg-black text-[8px] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Free</span>
                                            </div>
                                            <span className={`text-gray-400 transition-transform duration-500 ${openAddOn === 'engraving' ? 'rotate-45' : ''}`}>
                                                <FaPlus className="h-3 w-3" />
                                            </span>
                                        </button>

                                        {openAddOn === 'engraving' && (
                                            <div className="px-6 pb-8 pt-2 space-y-8 animate-in slide-in-from-top-4 duration-500">
                                                {/* Text Engraving */}
                                                <div className="space-y-4">
                                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 block">Personalised Text (Max 15 Characters)</label>
                                                    <input 
                                                        type="text"
                                                        value={engravingText}
                                                        onChange={(e) => setEngravingText(e.target.value.slice(0, 15))}
                                                        placeholder="e.g. Forever, A & S, 2024"
                                                        className="w-full border-b border-gray-200 py-3 text-sm focus:border-black outline-none transition-colors italic font-serif"
                                                    />
                                                </div>

                                                {/* Stone Selection */}
                                                <div className="space-y-4">
                                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 block">Add Accent Stone</label>
                                                    <div className="flex flex-wrap gap-2.5">
                                                        <button 
                                                            onClick={() => setSelectedStone(null)}
                                                            className={`w-12 h-12 rounded-sm border flex items-center justify-center transition-all ${selectedStone === null ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                                                            title="No Stone"
                                                        >
                                                            <div className="w-10 h-10 rounded-full border border-dashed border-gray-300 flex items-center justify-center">
                                                                <IoMdClose className="text-gray-400 text-xs" />
                                                            </div>
                                                        </button>
                                                        {stoneOptions.map((stone) => (
                                                            <button 
                                                                key={stone.id}
                                                                onClick={() => setSelectedStone(stone)}
                                                                className={`group relative w-12 h-12 rounded-sm border transition-all ${selectedStone?.id === stone.id ? 'border-black bg-white shadow-sm' : 'border-gray-200 hover:border-gray-300 bg-white'}`}
                                                                title={stone.label}
                                                            >
                                                                <div className="w-full h-full p-1.5 flex items-center justify-center">
                                                                    <img 
                                                                        src={stone.image} 
                                                                        alt={stone.label}
                                                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                                                                    />
                                                                </div>
                                                                {selectedStone?.id === stone.id && (
                                                                    <div className="absolute -top-1.5 -right-1.5 bg-black text-white rounded-full p-0.5 border border-white z-10">
                                                                        <FaCheck className="text-[6px]" />
                                                                    </div>
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    {selectedStone && (
                                                        <p className="text-[10px] font-medium text-gray-900 tracking-wide uppercase">{selectedStone.label}</p>
                                                    )}
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400 block">Finish</label>
                                                    <div className="flex">
                                                        <div className="p-3 border rounded-sm border-black bg-black text-white w-full max-w-[160px]">
                                                            <p className="text-[10px] font-bold uppercase tracking-widest">High Polish</p>
                                                            <p className="text-[8px] leading-tight font-light mt-1 text-gray-400">Mirror-like shine</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <button 
                                                    onClick={() => {
                                                        setIsCustomized(true);
                                                        setOpenAddOn(null);
                                                        toast.success("Customisations Applied!");
                                                    }}
                                                    className="w-full py-4 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black transition-colors rounded-sm"
                                                >
                                                    Apply Customisations
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Certificate */}
                                    {/* <div className="border border-gray-200 rounded-sm overflow-hidden">
                                        <button 
                                            onClick={() => setOpenAddOn(openAddOn === 'certificate' ? null : 'certificate')}
                                            className="w-full flex justify-between items-center px-6 py-5 hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="text-sm text-gray-700 tracking-wide font-light">Add Certificate</span>
                                            <span className={`text-gray-400 transition-transform duration-300 ${openAddOn === 'certificate' ? 'rotate-45' : ''}`}>
                                                <FaPlus className="h-3 w-3" />
                                            </span>
                                        </button>
                                    </div> */}
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 border-t border-gray-100 space-y-6">
                            <div className="flex items-center space-x-4">
                                <button 
                                    onClick={() => handleWishlistClick(product?._id)}
                                    className={`p-4 border border-black h-[60px] w-[60px] flex items-center justify-center transition-all ${isWishlisted(product?._id) ? 'bg-red-50 text-red-500 border-red-500' : 'bg-white text-black'}`}
                                >
                                    {isWishlisted(product?._id) ? <FaHeart className="h-5 w-5" /> : <FaRegHeart className="h-5 w-5" />}
                                </button>
                                
                                {currentUser?.userType !== 'admin' && currentQuantity > 0 ? (
                                    <div className="flex-grow h-[60px] flex items-center justify-between border border-black bg-white">
                                        <button 
                                            onClick={() => updateQuantity(currentQuantity - 1)}
                                            className="w-[60px] h-full flex items-center justify-center border-r border-gray-100 hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="text-lg font-bold text-black">-</span>
                                        </button>
                                        <div className="flex-grow flex flex-col items-center justify-center text-center">
                                            <span className="text-xl font-bold">{currentQuantity}</span>
                                            <span className="text-[8px] tracking-[0.2em] text-gray-400 uppercase font-bold">In Cart</span>
                                        </div>
                                        <button 
                                            onClick={() => updateQuantity(currentQuantity + 1)}
                                            className="w-[60px] h-full flex items-center justify-center border-l border-gray-100 hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="text-lg font-bold text-black">+</span>
                                        </button>
                                    </div>
                                ) : (
                                    <button 
                                        onClick={handleAddToCart}
                                        className="flex-grow h-[60px] bg-black text-white px-8 flex items-center justify-between group overflow-hidden relative"
                                    >
                                        <div className="flex items-baseline space-x-3">
                                            <span className="text-lg font-bold">₹{Number(product?.price).toLocaleString('en-IN')}</span>
                                            <span className="text-xs text-gray-400 line-through">₹{mrp.toLocaleString('en-IN')}</span>
                                        </div>
                                        <span className="text-[11px] font-bold tracking-[0.3em] uppercase group-hover:translate-x-2 transition-transform duration-300">Add to Cart</span>
                                    </button>
                                )}
                            </div>

                            <p className="text-center text-[12px] text-gray-500 tracking-wide">
                                Order <span className="text-black font-bold">Now</span> for estimated delivery by <span className="text-black font-bold">{formattedDeliveryDate}</span>
                            </p>
                        </div>

                        {/* Why Shop With Us */}
                        <div className="border border-gray-100 rounded-sm p-8 space-y-8">
                            <h3 className="text-lg text-gray-800 font-medium tracking-tight">Why Shop With Us</h3>
                            <div className="grid grid-cols-5 gap-2">
                                {[
                                    { icon: <FaShieldAlt className="h-5 w-5" />, label: "BIS Hallmark" },
                                    { icon: <HiOutlineArrowPath className="h-5 w-5" />, label: "Exchange & Buyback" },
                                    { icon: <LuRotateCcw className="h-5 w-5" />, label: "Free 15-Day Returns" },
                                    { icon: <FaAward className="h-5 w-5" />, label: "Certified" },
                                    { icon: <FaThumbsUp className="h-5 w-5" />, label: "Rated 4.7/5" }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex flex-col items-center space-y-3">
                                        <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 border border-gray-100 italic">
                                            {item.icon}
                                        </div>
                                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold text-center leading-tight">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Accordion Detail Sections */}
                        <div className="pt-4 space-y-0 border-t border-gray-100">
                            {[
                                { id: 'details', title: 'Product Details', content: product?.description },
                                { id: 'price', title: 'Price Break Up', content: "Standard labor and material costs apply." },
                                { id: 'origin', title: 'Manufacturer & Origin', content: "Indian Craftsmanship - Handcrafted with excellence." }
                            ].map((section) => (
                                <div key={section.id} className="border-b border-gray-100">
                                    <button 
                                        onClick={() => setOpenDetail(openDetail === section.id ? null : section.id)}
                                        className="w-full flex justify-between items-center py-6 text-left group"
                                    >
                                        <span className="text-base text-gray-800 font-normal tracking-wide">{section.title}</span>
                                        <span className="text-gray-400">
                                            {openDetail === section.id ? <FaPlus className="h-3 w-3 rotate-45 transition-transform" /> : <FaPlus className="h-3 w-3 transition-transform" />}
                                        </span>
                                    </button>
                                    {openDetail === section.id && (
                                        <div className="pb-8 text-sm text-gray-600 font-light leading-relaxed animate-fadeIn">
                                            {section.content}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* Customise Banner */}
            <div className="w-full bg-[#f4f1ea] py-16 px-4 md:px-0">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="space-y-8 text-center md:text-left">
                        <div className="space-y-4">
                            <h2 className="text-5xl md:text-6xl font-serif italic text-gray-800 leading-tight">Customise<br />Any Design</h2>
                            <p className="text-gray-500 font-light tracking-[0.2em] uppercase text-xs">Create your one-of-a-kind masterpiece</p>
                        </div>
                        <a 
                            href={`https://wa.me/919924559125?text=${encodeURIComponent(`Hello SilverWale! I'm interested in customising a design similar to "${product?.name}". Link: ${window.location.href}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-black text-white px-10 py-4 uppercase tracking-[0.3em] font-bold text-[11px] hover:bg-gray-900 transition-all rounded-sm shadow-xl"
                        >
                            Begin Chat Now
                        </a>
                    </div>
                    <div className="relative">
                        <img 
                            src="/ring_showcase_1.jpeg" 
                            className="w-[450px] h-auto object-contain drop-shadow-2xl mix-blend-multiply" 
                            alt="Custom Jewelry" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#f4f1ea]/40 to-transparent"></div>
                    </div>
                </div>
            </div>

            {/* You May Also Like Section */}
            <section className="max-w-7xl mx-auto px-4 py-24">
                <div className="text-center space-y-12">
                    <h2 className="text-2xl font-medium tracking-tight text-gray-900 font-sans">You May Also Like</h2>
                    
                    {/* Tabs */}
                    <div className="flex justify-center space-x-12 border-b border-gray-100 pb-1 overflow-x-auto no-scrollbar">
                        {[
                            { id: 'recommended', label: 'Recommended' },
                            { id: 'category', label: product?.categoryName || 'Similar Designs' },
                            { id: 'classic', label: 'Classic Rings' },
                            { id: 'more', label: 'More Rings' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`text-[12px] uppercase tracking-[0.2em] font-bold pb-4 transition-all relative ${activeTab === tab.id ? 'text-black' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                {tab.label}
                                {activeTab === tab.id && (
                                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-black"></div>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Product Grid */}
                    {similarLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                        </div>
                    ) : similarProducts.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-12 pt-10">
                            {similarProducts.slice(0, 5).map((p) => (
                                <div key={p._id} className="group relative flex flex-col space-y-4 text-left">
                                    <Link to={`/products/${p._id}`} className="block relative aspect-square bg-white overflow-hidden">
                                        <img 
                                            src={p.image?.[0] ? (p.image[0].includes('cloudinary.com') ? p.image[0] : `/${p.image[0].split(/[\\/]/).pop()}`) : '/ErrorImage.png'} 
                                            alt={p.name} 
                                            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <button 
                                            onClick={(e) => { e.preventDefault(); handleWishlistClick(p._id); }}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            {isWishlisted(p._id) ? <FaHeart className="h-5 w-5 text-red-500" /> : <FaRegHeart className="h-5 w-5" />}
                                        </button>
                                    </Link>
                                    <div className="space-y-2">
                                        <Link to={`/products/${p._id}`}>
                                            <h3 className="text-[13px] text-gray-500 font-light leading-relaxed line-clamp-2 hover:text-black transition-colors">{p.name}</h3>
                                        </Link>
                                        <p className="text-sm font-bold text-gray-900">₹{Number(p.price).toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-24 space-y-4">
                            <div className="w-12 h-[1px] bg-gray-200 mx-auto"></div>
                            <p className="text-gray-300 uppercase tracking-[0.3em] text-[9px] font-bold">Discovering curated pieces...</p>
                        </div>
                    )}
                </div>
            </section>

            <FloatingWhatsApp />

            {/* Size Guide Modal */}
            {isSizeGuideOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-sm shadow-2xl relative">
                        {/* Close Button */}
                        <button 
                            onClick={() => setIsSizeGuideOpen(false)}
                            className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black transition-colors z-10"
                        >
                            <IoMdClose size={24} />
                        </button>

                        <div className="p-8 md:p-12 space-y-12">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl font-serif italic text-gray-900 leading-tight">SilverWale Size Guide</h2>
                                <p className="text-[10px] tracking-[0.3em] uppercase text-gray-400 font-bold">Find your perfect fit</p>
                            </div>

                            {/* Rings Section */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="h-[1px] flex-grow bg-gray-100"></div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-800">Ring Size Chart</h3>
                                    <div className="h-[1px] flex-grow bg-gray-100"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-600 font-light leading-relaxed">
                                            Measure the <span className="font-medium text-black">inside diameter</span> of a ring you already own, or wrap a string around your finger and measure the length.
                                        </p>
                                        <div className="bg-gray-50 p-4 rounded-sm border border-gray-100">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Pro Tip</p>
                                            <p className="text-[11px] text-gray-600 italic">Measure at the end of the day when your fingers are slightly larger for the best fit.</p>
                                        </div>
                                    </div>
                                    <div className="overflow-x-auto border border-gray-100 rounded-sm">
                                        <table className="w-full text-[11px]">
                                            <thead className="bg-gray-50 border-b border-gray-100">
                                                <tr>
                                                    <th className="px-4 py-3 text-left font-bold text-gray-800 uppercase tracking-widest">Size</th>
                                                    <th className="px-4 py-3 text-left font-bold text-gray-800 uppercase tracking-widest">Inside Dia (mm)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {[
                                                    { s: '10', d: '15.9' }, { s: '12', d: '16.5' }, 
                                                    { s: '14', d: '17.2' }, { s: '16', d: '17.8' }, 
                                                    { s: '18', d: '18.5' }, { s: '20', d: '19.1' }
                                                ].map((row) => (
                                                    <tr key={row.s} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-3 font-medium text-black">{row.s}</td>
                                                        <td className="px-4 py-3 text-gray-500">{row.d} mm</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Bangles Section */}
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="h-[1px] flex-grow bg-gray-100"></div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-800">Bangle Size Chart</h3>
                                    <div className="h-[1px] flex-grow bg-gray-100"></div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                    <div className="overflow-x-auto border border-gray-100 rounded-sm order-2 md:order-1">
                                        <table className="w-full text-[11px]">
                                            <thead className="bg-gray-50 border-b border-gray-100">
                                                <tr>
                                                    <th className="px-4 py-3 text-left font-bold text-gray-800 uppercase tracking-widest">Size</th>
                                                    <th className="px-4 py-3 text-left font-bold text-gray-800 uppercase tracking-widest">Circumference</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {[
                                                    { s: '2/4', c: '7.07 inches' }, 
                                                    { s: '2/6', c: '7.46 inches' }, 
                                                    { s: '2/8', c: '7.85 inches' }
                                                ].map((row) => (
                                                    <tr key={row.s} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-3 font-medium text-black">{row.s}</td>
                                                        <td className="px-4 py-3 text-gray-500">{row.c}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="space-y-4 order-1 md:order-2">
                                        <p className="text-sm text-gray-600 font-light leading-relaxed">
                                            Tuck your thumb into your palm and measure around the <span className="font-medium text-black">widest part of your hand</span>.
                                        </p>
                                        <div className="flex justify-center py-4">
                                            <div className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-full flex flex-col items-center justify-center text-gray-300">
                                                <HiOutlineArrowPath size={24} className="mb-2" />
                                                <span className="text-[8px] uppercase tracking-widest font-bold">Circumference</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                             {/* Necklace Section */}
                             <div className="space-y-6">
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="h-[1px] flex-grow bg-gray-100"></div>
                                    <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-800">Necklace Lengths</h3>
                                    <div className="h-[1px] flex-grow bg-gray-100"></div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex flex-col space-y-4">
                                        {[
                                            { l: '16"', d: 'Choker Style: Sits at the base of the neck' },
                                            { l: '18"', d: 'Princess Style: Sits on the collarbone (Most Popular)' },
                                            { l: '20"', d: 'Matinee Style: Sits below the collarbone' }
                                        ].map((item) => (
                                            <div key={item.l} className="flex items-start space-x-6 p-4 border border-gray-50 rounded-sm hover:border-gray-100 transition-colors">
                                                <span className="text-xl font-serif italic text-gray-900">{item.l}</span>
                                                <div className="space-y-1">
                                                    <p className="text-xs font-bold uppercase tracking-widest text-black">{item.l} Length</p>
                                                    <p className="text-[11px] text-gray-500 font-light">{item.d}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 text-center">
                                <button 
                                    onClick={() => setIsSizeGuideOpen(false)}
                                    className="px-12 py-4 bg-black text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-gray-800 transition-colors rounded-sm"
                                >
                                    Understood
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
}

export default ProductDescription;
