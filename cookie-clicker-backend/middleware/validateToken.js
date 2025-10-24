const jwt = require('jsonwebtoken');

const validateToken = async (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ message: "Token is missing or invalid" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                message: "Token invalid or expired",
                code: "TOKEN_EXPIRIED"
            });
        }
        req.user = decoded.user;
        next();
    })
}

module.exports = validateToken;