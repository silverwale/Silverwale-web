import express from 'express'
import { getAllAdminOrders, getAllOrders, updateStatus, createOrder, getOrderById } from '../controllers/orderController.js';

const router=express.Router();

router.post('/create', createOrder);
router.get('/getorder/:orderId', getOrderById);
router.get('/getorders/:userId',getAllOrders);
router.patch('/updatestatus/:orderId',updateStatus);
router.get('/getadminorders',getAllAdminOrders);


export default router;