import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { FaShieldAlt, FaRegEye } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    fetchCartItemsRequest, 
    fetchCartItemsSuccess, 
    fetchCartItemsFailure, 
    removeCartItemStart, 
    removeCartItemSuccess, 
    removeCartItemFailure, 
    updateCartItemQuantityStart, 
    updateCartItemQuantitySuccess, 
    updateCartItemQuantityFailure,
    removeFromCartGuest,
    updateQuantityGuest
} from '../redux/slices/cartSlice';
import Header from '../components/Header';

// Simple Box Icon SVG (Moved to top to prevent ReferenceError)
const BoxIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
    </svg>
);

function Cart() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { cartItems = [], loading, error } = useSelector(state => state.cart);
    const { currentUser } = useSelector(state => state.user);
    const userId = currentUser?._id;

    const [deliveryCharge, setDeliveryCharge] = useState(0); // FREE in mockup

    useEffect(() => {
        if (userId) {
            fetchCartItems(userId);
        }
    }, [userId, dispatch]);

    const fetchCartItems = async (userId) => {
        dispatch(fetchCartItemsRequest());
        try {
            const response = await fetch(`${import.meta.env.VITE_PORT}/api/cart/getcart/${userId}`);
            if (!response.ok) throw new Error('Failed to fetch items');
            const data = await response.json();
            dispatch(fetchCartItemsSuccess(Array.isArray(data) ? data : []));
        } catch (error) {
            dispatch(fetchCartItemsFailure(error.message));
        }
    };

    const handleDelete = async (itemId) => {
        if (!userId) {
            dispatch(removeFromCartGuest(itemId));
            toast.success("Item removed");
            return;
        }
        dispatch(removeCartItemStart());
        try {
            const res = await fetch(`${import.meta.env.VITE_PORT}/api/cart/delete/${itemId}`, {
                method: "DELETE"
            });
            if (!res.ok) throw new Error('Failed to delete item');
            dispatch(removeCartItemSuccess(itemId));
            toast.success("Item removed");
        } catch (error) {
            dispatch(removeCartItemFailure(error.message));
        }
    };

    const updateCartItemQuantity = async (cartItemId, quantity) => {
        if (!userId) {
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
        }
    };

    const validatedCartItems = Array.isArray(cartItems) ? cartItems : [];
    const subtotalMRP = validatedCartItems.reduce((acc, item) => acc + ((item.product?.price || 0) + 5000) * item.quantity, 0);
    const orderTotal = validatedCartItems.reduce((acc, item) => acc + (item.product?.price || 0) * item.quantity, 0);
    const productDiscount = subtotalMRP - orderTotal;

    return (
        <div className="min-h-screen bg-[#FDFDFD]">
            <Header />
            
            {/* Cart Header */}
            <div className='max-w-7xl mx-auto px-4 md:px-8 py-6 flex justify-between items-center bg-white border-b border-gray-50'>
                <h1 className='text-sm font-medium text-gray-800'>Cart</h1>
                <span className='text-[10px] font-bold text-gray-300 uppercase tracking-widest'>Step 1/3</span>
            </div>

            <div className='max-w-7xl mx-auto px-4 md:px-8 py-10'>
                {validatedCartItems.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-gray-200">
                        <p className="text-gray-400 text-xs uppercase tracking-widest mb-4">Your gold bag is empty</p>
                        <Link to="/" className="text-black font-bold uppercase text-[10px] border-b border-black pb-1 hover:text-gray-500 hover:border-gray-300 transition-all">Start Shopping</Link>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 lg:grid-cols-3 gap-10 items-start'>
                        
                        {/* Cart Items List */}
                        <div className='lg:col-span-2 space-y-6'>
                            <div className="flex items-center space-x-2 text-gray-500 mb-4">
                                <BoxIcon className="w-4 h-4" />
                                <span className="text-xs font-medium">Item : {validatedCartItems.length}</span>
                            </div>

                            {validatedCartItems.map((item) => {
                                const coverIdx = item.product?.coverImageIndex ?? 0;
                                const filename = item.product?.image?.[coverIdx] || item.product?.image?.[0];
                                const displayImg = filename ? (filename.includes('cloudinary.com') ? filename : `/${filename.split(/[\\/]/).pop()}`) : '/ErrorImage.png';

                                return (
                                    <div key={item.cartItemId} className='bg-white border border-gray-100 rounded-sm relative group animate-fadeIn'>
                                        <div className='p-6 flex flex-col md:flex-row gap-8'>
                                            {/* Product Image */}
                                            <div className='w-full md:w-32 h-32 flex-shrink-0 bg-gray-50 p-2 border border-gray-50'>
                                                <img 
                                                    src={displayImg} 
                                                    alt={item.product?.name}
                                                    className='w-full h-full object-contain mix-blend-multiply'
                                                    onError={(e) => e.target.src = '/ErrorImage.png'}
                                                />
                                            </div>

                                            {/* Details */}
                                            <div className='flex-grow space-y-4 pt-2'>
                                                <div className="flex justify-between items-start">
                                                    <h2 className='text-xs md:text-sm font-medium text-gray-600 leading-relaxed max-w-md'>
                                                        {item.product?.name}
                                                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                                                            {item.size && (
                                                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                                                                    Size: {item.size}
                                                                </span>
                                                            )}
                                                            {item.metalType && (
                                                                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                                                                    Metal: {
                                                                        item.metalType === 'SS' ? '925 Silver' :
                                                                        item.metalType === 'RS' ? 'Rose Silver' :
                                                                        item.metalType === 'YS' ? 'Yellow Silver' :
                                                                        item.metalType
                                                                    }
                                                                </span>
                                                            )}
                                                            {item.engraving && (
                                                                <span className="text-[10px] text-blue-500 italic font-serif">
                                                                    "{item.engraving}"
                                                                </span>
                                                            )}
                                                            {item.stone && (
                                                                <span className={`text-[10px] font-bold uppercase tracking-widest ${
                                                                    item.stone.toLowerCase().includes('ruby') ? 'text-red-500' :
                                                                    item.stone.toLowerCase().includes('emerald') ? 'text-emerald-500' :
                                                                    item.stone.toLowerCase().includes('sapphire') && !item.stone.toLowerCase().includes('pink') ? 'text-blue-500' :
                                                                    item.stone.toLowerCase().includes('citrine') ? 'text-amber-500' :
                                                                    item.stone.toLowerCase().includes('amethyst') ? 'text-purple-500' :
                                                                    item.stone.toLowerCase().includes('pink') ? 'text-pink-500' :
                                                                    item.stone.toLowerCase().includes('black') ? 'text-gray-900' :
                                                                    'text-gray-400'
                                                                }`}>
                                                                    {item.stone}
                                                                </span>
                                                            )}
                                                            {item.finish && (
                                                                <span className="text-[10px] text-amber-500 uppercase tracking-widest font-bold">
                                                                    {item.finish}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </h2>
                                                    <button 
                                                        onClick={() => handleDelete(item.cartItemId)}
                                                        className="text-gray-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <IoMdClose className="text-xl" />
                                                    </button>
                                                </div>

                                                <div className='flex items-center space-x-4'>
                                                    <div className='relative'>
                                                        <select 
                                                            className='bg-gray-50 border-none text-[10px] font-bold py-1 px-4 pr-8 appearance-none focus:ring-1 focus:ring-black rounded-sm cursor-pointer'
                                                            value={item.quantity}
                                                            onChange={(e) => updateCartItemQuantity(item.cartItemId, parseInt(e.target.value))}
                                                        >
                                                            {[...Array(10)].map((_, i) => (
                                                                <option key={i+1} value={i+1}>Qty: {i+1}</option>
                                                            ))}
                                                        </select>
                                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                                                            <svg className="fill-current h-3 w-3" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className='flex items-baseline space-x-3'>
                                                    <span className='text-sm font-bold text-black'>₹{(item.product?.price || 0).toLocaleString()}</span>
                                                    <span className='text-[11px] text-gray-300 line-through'>₹{((item.product?.price || 0) + 5000).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Bottom Action */}
                                        <div className='border-t border-gray-50 flex justify-center py-3'>
                                            <Link to={`/products/${item.product?._id}`} className="flex items-center space-x-2 text-gray-400 hover:text-black transition-colors uppercase tracking-[0.2em] text-[9px] font-bold">
                                                <FaRegEye className="w-3" />
                                                <span>View Details</span>
                                            </Link>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className='space-y-6'>
                            <div className="flex items-center space-x-2 text-gray-500 mb-4">
                                <BoxIcon className="w-4 h-4" />
                                <span className="text-xs font-medium">Order Summary</span>
                            </div>

                            <div className='bg-white border border-gray-100 p-8 space-y-6 rounded-sm'>
                                <div className='space-y-4'>
                                    <div className='flex justify-between text-xs text-gray-500'>
                                        <p>Subtotal (MRP)</p>
                                        <p>₹{subtotalMRP.toLocaleString()}</p>
                                    </div>
                                    <div className='flex justify-between text-xs'>
                                        <p className="text-gray-500">Product Discount</p>
                                        <p className="text-green-600">-₹{productDiscount.toLocaleString()}</p>
                                    </div>
                                    <div className='flex justify-between text-xs'>
                                        <p className="text-gray-500">Shipping</p>
                                        <p className="text-green-600">Free</p>
                                    </div>
                                </div>

                                <div className='pt-6 border-t border-gray-100'>
                                    <div className='flex justify-between items-baseline'>
                                        <div className="space-y-1">
                                            <p className='text-sm font-bold text-gray-800'>Order Total</p>
                                            <p className='text-[9px] text-gray-400 font-medium uppercase'>(including GST)</p>
                                        </div>
                                        <p className='text-xl font-bold'>₹{orderTotal.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={() => {
                                    if (currentUser) {
                                        navigate('/checkout');
                                    } else {
                                        toast.info("Please sign in to complete your purchase");
                                        navigate('/signin', { state: { from: '/checkout' } });
                                    }
                                }}
                                className='w-full bg-black text-white py-4 rounded-sm flex items-center justify-center space-x-3 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-gray-800 transition-all shadow-xl active:scale-[0.98]'
                            >
                                <FaShieldAlt className="text-white h-3 w-3" />
                                <span>Secure Checkout &nbsp;&gt;</span>
                            </button>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
}

export default Cart;
