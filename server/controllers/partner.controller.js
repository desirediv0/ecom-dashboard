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
