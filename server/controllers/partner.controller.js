;
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponsive } from '../utils/ApiResponsive.js';
import { prisma } from '../config/db.js';


// Register as partner (public)
export const registerPartner = asyncHandler(async (req, res) => {
    const { name, email, number, city, state, message } = req.body;
    if (!name || !email || !number || !city || !state || !message) {
        return res.status(400).json(new ApiResponsive(400, null, 'All fields are required'));
    }
    // Check if already requested
    const exists = await prisma.partnerRequest.findFirst({ where: { email } });
    if (exists) {
        return res.status(409).json(new ApiResponsive(409, null, 'Request already submitted'));
    }
    const request = await prisma.partnerRequest.create({
        data: { name, email, number, city, state, message },
    });
    res.status(201).json(new ApiResponsive(201, { request }, 'Request submitted'));
});

// Partner login (only if approved)
export const partnerLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json(new ApiResponsive(400, null, 'Email and password required'));
    }
    const partner = await prisma.partner.findUnique({ where: { email } });
    if (!partner || !partner.isActive) {
        return res.status(401).json(new ApiResponsive(401, null, 'Invalid credentials'));
    }
    const match = await bcrypt.compare(password, partner.password);
    if (!match) {
        return res.status(401).json(new ApiResponsive(401, null, 'Invalid credentials'));
    }
    // Generate JWT
    const token = jwt.sign({ id: partner.id, email: partner.email, role: 'partner' }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json(new ApiResponsive(200, { token, partner: { id: partner.id, name: partner.name, email: partner.email } }, 'Login successful'));
});

// Get partner profile (protected)
export const getPartnerProfile = asyncHandler(async (req, res) => {
    const partner = await prisma.partner.findUnique({
        where: { id: req.partner.id },
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            commissionRate: true,
            isActive: true,
            createdAt: true
        }
    });

    res.status(200).json(new ApiResponsive(200, { partner }, 'Profile fetched successfully'));
});

// Get partner dashboard stats (protected)
export const getPartnerDashboard = asyncHandler(async (req, res) => {
    const partnerId = req.partner.id;

    // Get total coupons assigned to this partner
    const totalCoupons = await prisma.couponPartner.count({
        where: { partnerId }
    });

    // Get only DELIVERED orders for commission calculation
    const orders = await prisma.order.findMany({
        where: {
            status: 'DELIVERED', // Only count delivered orders for earnings
            coupon: {
                couponPartners: {
                    some: { partnerId }
                }
            }
        },
        include: {
            coupon: {
                include: {
                    couponPartners: {
                        where: { partnerId }
                    }
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    // Calculate actual commission earned from each order
    let totalOrderValue = 0;
    let totalCommissionEarned = 0;
    let totalCommissionRate = 0;

    orders.forEach(order => {
        const orderAmount = parseFloat(order.total || 0);
        const commissionPercentage = order.coupon?.couponPartners[0]?.commission || 0;
        const commissionEarned = (orderAmount * commissionPercentage) / 100;

        totalOrderValue += orderAmount;
        totalCommissionEarned += commissionEarned;
        totalCommissionRate += commissionPercentage;
    });

    // Calculate average commission rate
    const averageCommissionRate = orders.length > 0 ? totalCommissionRate / orders.length : 0;

    // Get recent orders (top 3)
    const recentOrders = orders.slice(0, 3);

    res.status(200).json(new ApiResponsive(200, {
        stats: {
            totalCoupons,
            totalEarnings: parseFloat(totalOrderValue.toFixed(2)),
            estimatedCommission: parseFloat(totalCommissionEarned.toFixed(2)),
            commissionRate: parseFloat(averageCommissionRate.toFixed(2))
        },
        recentOrders
    }, 'Dashboard data fetched successfully'));
});

// Get partner coupons (protected)
export const getPartnerCoupons = asyncHandler(async (req, res) => {
    const partnerId = req.partner.id;

    const coupons = await prisma.couponPartner.findMany({
        where: { partnerId },
        include: {
            coupon: {
                include: {
                    _count: {
                        select: {
                            orders: {
                                where: {
                                    status: 'DELIVERED' // Only count delivered orders
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // Calculate actual earnings for each coupon (only from delivered orders)
    const couponsWithEarnings = await Promise.all(
        coupons.map(async (couponPartner) => {
            // Get only DELIVERED orders using this specific coupon for this partner
            const ordersForCoupon = await prisma.order.findMany({
                where: {
                    couponId: couponPartner.couponId,
                    status: 'DELIVERED', // Only delivered orders count for earnings
                    coupon: {
                        couponPartners: {
                            some: { partnerId: couponPartner.partnerId }
                        }
                    }
                },
                include: {
                    coupon: {
                        include: {
                            couponPartners: {
                                where: { partnerId: couponPartner.partnerId }
                            }
                        }
                    }
                }
            });

            // Calculate actual earnings from delivered orders only
            let actualEarnings = 0;
            ordersForCoupon.forEach(order => {
                const orderAmount = parseFloat(order.total || 0);
                const commissionRate = order.coupon?.couponPartners[0]?.commission || couponPartner.commission || 0;
                actualEarnings += (orderAmount * commissionRate) / 100;
            });

            return {
                ...couponPartner,
                actualEarnings: parseFloat(actualEarnings.toFixed(2)),
                orderCount: ordersForCoupon.length
            };
        })
    );

    res.status(200).json(new ApiResponsive(200, { coupons: couponsWithEarnings }, 'Coupons fetched successfully'));
});

// Get partner earnings (protected)
export const getPartnerEarnings = asyncHandler(async (req, res) => {
    const partnerId = req.partner.id;
    const { period = 'all' } = req.query;

    // Build date filter based on period
    let dateFilter = {};
    const now = new Date();

    switch (period) {
        case 'today':
            dateFilter = {
                createdAt: {
                    gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
                    lt: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
                }
            };
            break;
        case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            dateFilter = {
                createdAt: {
                    gte: weekAgo
                }
            };
            break;
        case 'month':
            dateFilter = {
                createdAt: {
                    gte: new Date(now.getFullYear(), now.getMonth(), 1)
                }
            };
            break;
        case 'year':
            dateFilter = {
                createdAt: {
                    gte: new Date(now.getFullYear(), 0, 1)
                }
            };
            break;
        default:
            // 'all' - no date filter
            break;
    }

    // Get detailed earnings with orders (only DELIVERED orders)
    const orders = await prisma.order.findMany({
        where: {
            ...dateFilter,
            status: 'DELIVERED', // Only show earnings from delivered orders
            coupon: {
                couponPartners: {
                    some: { partnerId }
                }
            }
        },
        include: {
            coupon: {
                include: {
                    couponPartners: {
                        where: { partnerId }
                    }
                }
            },
            user: {
                select: {
                    name: true,
                    email: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    // Calculate earnings for each order
    const earningsData = orders.map(order => {
        const couponPartner = order.coupon?.couponPartners[0];
        const commissionRate = couponPartner?.commission || 0;
        const orderTotal = parseFloat(order.total || 0);
        const earningAmount = (orderTotal * commissionRate) / 100;

        return {
            id: order.id,
            orderNumber: order.orderNumber,
            orderAmount: orderTotal,
            commission: commissionRate,
            earningAmount: parseFloat(earningAmount.toFixed(2)),
            couponCode: order.coupon?.code,
            customerName: order.user?.name,
            customerEmail: order.user?.email,
            orderStatus: order.status,
            paymentStatus: order.razorpayPayment ? 'paid' : 'pending',
            date: order.createdAt,
            createdAt: order.createdAt
        };
    });

    // Calculate summary statistics
    const totalEarnings = earningsData.reduce((sum, earning) => sum + earning.earningAmount, 0);
    const totalOrders = earningsData.length;
    const averageCommission = totalOrders > 0
        ? earningsData.reduce((sum, earning) => sum + earning.commission, 0) / totalOrders
        : 0;

    // Calculate this month's earnings
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyEarnings = earningsData
        .filter(earning => new Date(earning.date) >= thisMonth)
        .reduce((sum, earning) => sum + earning.earningAmount, 0);

    const summary = {
        totalEarnings: parseFloat(totalEarnings.toFixed(2)),
        monthlyEarnings: parseFloat(monthlyEarnings.toFixed(2)),
        totalOrders,
        averageCommission: parseFloat(averageCommission.toFixed(2)),
        period
    };

    res.status(200).json(new ApiResponsive(200, {
        earnings: earningsData,
        summary
    }, 'Earnings fetched successfully'));
});
