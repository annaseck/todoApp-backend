import jwt from "jsonwebtoken";

const authorize = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({
            success: false,
            error: "Unauthorized"
        });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

export default authorize;