
import bcrypt from 'bcryptjs';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponsive } from '../utils/ApiResponsive.js';
import { prisma } from '../config/db.js';


// List all partner requests
export const listPartnerRequests = asyncHandler(async (req, res) => {
    const requests = await prisma.partnerRequest.findMany({
        orderBy: { createdAt: 'desc' },
        include: { partner: true },
    });
    // Remove password from partner in each request
    const safeRequests = requests.map(r => ({
        ...r,
        partner: r.partner ? (({ password, ...rest }) => rest)(r.partner) : undefined
    }));
    res.status(200).json(new ApiResponsive(200, { requests: safeRequests }, 'Partner requests fetched'));
});

// Approve partner request and set password
export const approvePartnerRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const { password } = req.body;
    if (!password) return res.status(400).json(new ApiResponsive(400, null, 'Password required'));
    const request = await prisma.partnerRequest.findUnique({ where: { id: requestId } });
    if (!request || request.status !== 'PENDING') {
        return res.status(404).json(new ApiResponsive(404, null, 'Request not found or already processed'));
    }
    // Create partner
    const hashed = await bcrypt.hash(password, 10);
    const partner = await prisma.partner.create({
        data: {
            name: request.name,
            email: request.email,
            password: hashed,
            number: request.number,
            city: request.city,
            state: request.state,
            isActive: true,
            request: { connect: { id: request.id } },
        },
    });
    // Update request
    await prisma.partnerRequest.update({
        where: { id: request.id },
        data: { status: 'APPROVED', partnerId: partner.id },
    });
    res.status(200).json(new ApiResponsive(200, { partner }, 'Partner approved'));
});

// Reject partner request
export const rejectPartnerRequest = asyncHandler(async (req, res) => {
    const { requestId } = req.params;
    const request = await prisma.partnerRequest.findUnique({ where: { id: requestId } });
    if (!request || request.status !== 'PENDING') {
        return res.status(404).json(new ApiResponsive(404, null, 'Request not found or already processed'));
    }
    await prisma.partnerRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' },
    });
    res.status(200).json(new ApiResponsive(200, null, 'Partner request rejected'));
});

// Get full partner details (admin only)
export const getPartnerDetails = asyncHandler(async (req, res) => {
    const { partnerId } = req.params;

    const partner = await prisma.partner.findUnique({
        where: { id: partnerId },
        include: {
            couponPartners: {
                include: {
                    coupon: true
                }
            },
            earnings: true,
        },
    });
    if (!partner) return res.status(404).json(new ApiResponsive(404, null, 'Partner not found'));

    // Earnings summary (only from DELIVERED orders)
    const earnings = await prisma.partnerEarning.findMany({
        where: {
            partnerId,
            order: {
                status: 'DELIVERED' // Only include earnings from delivered orders
            }
        },
        select: { amount: true, createdAt: true },
    });
    let totalEarnings = 0;
    const monthlyEarnings = {};
    earnings.forEach(e => {
        totalEarnings += parseFloat(e.amount);
        const month = e.createdAt.getFullYear() + '-' + String(e.createdAt.getMonth() + 1).padStart(2, '0');
        if (!monthlyEarnings[month]) monthlyEarnings[month] = 0;
        monthlyEarnings[month] += parseFloat(e.amount);
    });

    // Return password for admin only (this endpoint is admin-protected)
    // Remove password from partner object and transform couponPartners to coupons
    const { password, couponPartners, ...partnerSafe } = partner;

    // Transform couponPartners to simpler coupons array for frontend compatibility
    const coupons = couponPartners?.map(cp => ({
        ...cp.coupon,
        commission: cp.commission
    })) || [];

    res.status(200).json(new ApiResponsive(200, {
        partner: partnerSafe,
        coupons: coupons,
        earnings: {
            total: totalEarnings,
            monthly: monthlyEarnings,
        },
    }, 'Partner details fetched'));
});

// Manual commission creation for testing (admin only)
export const createManualCommission = asyncHandler(async (req, res) => {
    const { partnerId, orderId, couponId, amount, percentage } = req.body;

    if (!partnerId || !orderId || !couponId || !amount || !percentage) {
        return res.status(400).json(new ApiResponsive(400, null, 'All fields required'));
    }

    // Verify partner exists
    const partner = await prisma.partner.findUnique({ where: { id: partnerId } });
    if (!partner) {
        return res.status(404).json(new ApiResponsive(404, null, 'Partner not found'));
    }

    // Verify order exists
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
        return res.status(404).json(new ApiResponsive(404, null, 'Order not found'));
    }

    // Create commission
    const commission = await prisma.partnerEarning.create({
        data: {
            partnerId,
            orderId,
            couponId,
            amount: parseFloat(amount).toFixed(2),
            percentage: parseFloat(percentage),
        },
    });

    res.status(201).json(new ApiResponsive(201, { commission }, 'Manual commission created'));
});

// Create commissions for existing orders with coupons (one-time fix)
export const createCommissionsForExistingOrders = asyncHandler(async (req, res) => {
    try {
        // Find all orders with coupons that don't have commissions yet
        const ordersWithCoupons = await prisma.order.findMany({
            where: {
                couponId: { not: null },
                partnerEarnings: { none: {} } // Orders without any commissions
            },
            include: {
                coupon: {
                    include: {
                        couponPartners: {
                            include: { partner: true }
                        }
                    }
                }
            }
        });

        console.log(`Found ${ordersWithCoupons.length} orders with coupons but no commissions`);

        let commissionsCreated = 0;

        for (const order of ordersWithCoupons) {
            if (order.coupon && order.coupon.couponPartners.length > 0) {
                // Calculate final order amount (subtotal - discount)
                const finalOrderAmount = parseFloat(order.subTotal) - parseFloat(order.discount);

                if (finalOrderAmount > 0) {
                    for (const couponPartner of order.coupon.couponPartners) {
                        if (couponPartner.commission && couponPartner.commission > 0) {
                            // Calculate commission based on FINAL ORDER AMOUNT (not discount)
                            const commissionAmount = (finalOrderAmount * couponPartner.commission) / 100;

                            await prisma.partnerEarning.create({
                                data: {
                                    partnerId: couponPartner.partnerId,
                                    orderId: order.id,
                                    couponId: order.couponId,
                                    amount: commissionAmount.toFixed(2),
                                    percentage: couponPartner.commission,
                                },
                            });

                            commissionsCreated++;
                            console.log(`Created commission for partner ${couponPartner.partner.name} on order ${order.orderNumber}: ₹${commissionAmount.toFixed(2)} (${couponPartner.commission}% of final order ₹${finalOrderAmount.toFixed(2)})`);
                        }
                    }
                }
            }
        }

        res.status(200).json(new ApiResponsive(200,
            {
                ordersProcessed: ordersWithCoupons.length,
                commissionsCreated
            },
            `Created ${commissionsCreated} commissions for ${ordersWithCoupons.length} existing orders`
        ));
    } catch (error) {
        console.error('Error creating commissions for existing orders:', error);
        res.status(500).json(new ApiResponsive(500, null, 'Error creating commissions'));
    }
});

// Remove a coupon from a partner (admin only)
export const removePartnerCoupon = asyncHandler(async (req, res) => {
    const { partnerId, couponId } = req.params;
    // Set coupon.partnerId to null
    const coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
    if (!coupon || coupon.partnerId !== partnerId) {
        return res.status(404).json(new ApiResponsive(404, null, 'Coupon not assigned to this partner'));
    }
    await prisma.coupon.update({ where: { id: couponId }, data: { partnerId: null } });
    res.status(200).json(new ApiResponsive(200, null, 'Coupon removed from partner'));
});
