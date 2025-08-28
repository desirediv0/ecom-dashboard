import express from 'express';
import { registerPartner, partnerLogin } from '../controllers/partner.controller.js';

const router = express.Router();

// Public registration
router.post('/register', registerPartner);
// Partner login
router.post('/login', partnerLogin);

export default router;
