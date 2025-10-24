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
            // fall back to IP-like value
        }

        // Avoid using `req.ip` directly to satisfy express-rate-limit IPv6 checks.
        // Prefer X-Forwarded-For (when behind proxy) then socket remoteAddress.
        const xff = req.headers && (req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For']);
        if (xff) {
            // x-forwarded-for may contain a list: client, proxy1, proxy2
            const first = String(xff).split(',')[0].trim();
            if (first) return first;
        }

        // Fallback to socket remoteAddress or connection remoteAddress
        return (req.socket && req.socket.remoteAddress) || (req.connection && req.connection.remoteAddress) || '';
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
