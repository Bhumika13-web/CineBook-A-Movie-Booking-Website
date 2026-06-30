import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
    try {
        const { token } = req.headers;
        if (!token) {
            return res.json({ success: false, message: "Not Authorized. Login Again" });
        }
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@cinebook.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        const token_decode = jwt.verify(token, process.env.JWT_SECRET || 'secret123');

        if (token_decode !== adminEmail + adminPassword) {
            return res.json({ success: false, message: "Not Authorized. Login Again" });
        }
        next();
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

export default adminAuth;
