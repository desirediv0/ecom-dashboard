import express from 'express';
import {
    registerPartner,
    partnerLogin,
    getPartnerProfile,
    getPartnerDashboard,
    getPartnerCoupons,
    getPartnerEarnings
} from '../controllers/partner.controller.js';
import { verifyPartnerToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerPartner);
router.post('/login', partnerLogin);

// Protected routes (require partner authentication)
router.use(verifyPartnerToken); // Apply middleware to all routes below

router.get('/profile', getPartnerProfile);
router.get('/dashboard', getPartnerDashboard);
router.get('/coupons', getPartnerCoupons);
router.get('/earnings', getPartnerEarnings);

export default router;
