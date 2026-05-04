const { verify } = require('jsonwebtoken');
require('dotenv').config();

const authentication = (allowedRoles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "User Authentication Failed" });
        }

        const token = authHeader.split(' ')[1];

        try {
            const decoded = verify(token, process.env.SECRET_KEY);

            if (decoded.exp < Date.now() / 1000) {
                return res.status(401).json({ message: "Token has expired" });
            }

            // Optional: role check
            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
                console.log("Decoded token:", decoded);
                console.log("Allowed roles:", allowedRoles);
                console.log("User role:", decoded.role);
                return res.status(403).json({ message: "Access Denied: Unauthorized Role" });
            }

            req.user = decoded;
            // Inside your middleware
            next();
        } catch (error) {
            return res.status(401).json({ message: "Invalid Token" });
        }
    };
};

module.exports = authentication;
