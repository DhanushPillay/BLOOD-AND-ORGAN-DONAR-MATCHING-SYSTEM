const { doubleCsrf } = require("csrf-csrf");

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || process.env.JWT_SECRET,
  getSessionIdentifier: (req) => {
    const token = req.cookies?.accessToken || req.cookies?.refreshToken;
    if (token) return token;
    return req.ip + "|" + (req.get("User-Agent") || "");
  },
  cookieName: "csrf-token",
  cookieOptions: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/",
  },
  ignoredMethods: ["GET", "HEAD", "OPTIONS"],
  ignoredPaths: ["/api/auth/refresh"],
});

module.exports = { generateCsrfToken, doubleCsrfProtection };
