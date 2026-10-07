import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { addToWishlist, getWishlist, removeFromWishlist } from '../controllers/wishlistController.js';

const router = express.Router();

router.post('/add', verifyToken, addToWishlist);
router.post('/remove', verifyToken, removeFromWishlist);
router.get('/', verifyToken, getWishlist);

export default router;
