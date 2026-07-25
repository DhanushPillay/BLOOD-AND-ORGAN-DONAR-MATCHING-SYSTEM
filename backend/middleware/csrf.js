const { doubleCsrf } = require("csrf-csrf");

const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || process.env.JWT_SECRET,
  getSessionIdentifier: (req) => {
    let token = req.cookies?.accessToken || req.cookies?.refreshToken;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }
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
