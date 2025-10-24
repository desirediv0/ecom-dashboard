import rateLimit from "express-rate-limit";

// Rate limiter for OTP and sensitive email actions (1 request per minute per email or IP)
export const otpRateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 1, // limit each key to 1 request per window
    message: {
        success: false,
        message: "Too many requests. Please try again after a minute.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Prefer to key by email when available to avoid blocking users behind NAT
    keyGenerator: (req) => {
        try {
            const bodyEmail = req.body && (req.body.email || req.body?.data?.email);
            if (bodyEmail) return String(bodyEmail).toLowerCase();
        } catch (e) {
            // fall back to IP
        }
        return req.ip;
    },
});

// Generic rate limiter (optional) - e.g., 100 requests per 15 minutes per IP
export const generalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});

export default otpRateLimiter;
