import express from 'express'
import { createPayment, paymentVerification, paymentWebhook } from '../controllers/paymentController.js';

const router=express.Router();

router.post('/createpayment',createPayment)
router.post('/verifypayment',paymentVerification)
router.post('/webhook', paymentWebhook)

export default router;

