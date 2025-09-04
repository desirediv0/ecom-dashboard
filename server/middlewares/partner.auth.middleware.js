import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';
import { ApiResponsive } from '../utils/ApiResponsive.js';

export const verifyPartnerJWT = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json(new ApiResponsive(401, null, 'Access token required'));
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find partner
        const partner = await prisma.partner.findUnique({
            where: {
                id: decoded.partnerId,
                isActive: true
            }
        });

        if (!partner) {
            return res.status(401).json(new ApiResponsive(401, null, 'Invalid token or partner not found'));
        }

        // Remove password from partner object
        const { password, ...partnerData } = partner;
        req.partner = partnerData;

        next();
    } catch (error) {
        return res.status(401).json(new ApiResponsive(401, null, 'Invalid token'));
    }
};
