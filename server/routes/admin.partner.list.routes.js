import express from "express";
import { isAdmin } from "../middlewares/auth.middleware.js";
import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Get all approved partners (for coupon assignment dropdown)
router.get("/partners/approved", isAdmin, async (req, res) => {
    try {
        const partners = await prisma.partner.findMany({
            where: { isActive: true },
            select: { id: true, name: true, email: true },
            orderBy: { name: "asc" },
        });
        return res.status(200).json({
            success: true,
            message: "Approved partners fetched successfully",
            data: { partners },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch partners",
            error: error.message,
        });
    }
});

export default router;
