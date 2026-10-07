import express from 'express';
import { createAdmin, deleteAdminById, getAllAdmins } from '../controllers/adminController.js';

const router = express.Router();

router.post('/', createAdmin);
router.get('/', getAllAdmins);
router.delete('/:id',deleteAdminById);

export default router;
