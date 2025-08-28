import express from 'express';
import {
    listPartnerRequests,
    approvePartnerRequest,
    rejectPartnerRequest,
    getPartnerDetails,
    removePartnerCoupon,
    createManualCommission,
    createCommissionsForExistingOrders
} from '../controllers/admin.partner.controller.js';
import { verifyAdminJWT } from '../middlewares/admin.middleware.js';


const router = express.Router();


// List all partner requests
router.get('/requests', verifyAdminJWT, listPartnerRequests);
// Approve a partner request (set password)
router.post('/requests/:requestId/approve', verifyAdminJWT, approvePartnerRequest);
// Reject a partner request
router.post('/requests/:requestId/reject', verifyAdminJWT, rejectPartnerRequest);

// Get full partner details (admin only)
router.get('/:partnerId/details', verifyAdminJWT, getPartnerDetails);
// Remove a coupon from a partner (admin only)
router.delete('/:partnerId/coupons/:couponId', verifyAdminJWT, removePartnerCoupon);
// Create manual commission for testing (admin only)
router.post('/commission/create', verifyAdminJWT, createManualCommission);
// Create commissions for existing orders (one-time fix)
router.post('/commission/fix-existing', verifyAdminJWT, createCommissionsForExistingOrders);

export default router;
