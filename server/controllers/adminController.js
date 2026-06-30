import jwt from 'jsonwebtoken';

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Use environment variables for admin credentials. Default to a fallback for demo purposes if not set.
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@cinebook.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

        if (email === adminEmail && password === adminPassword) {
            const token = jwt.sign(email + password, process.env.JWT_SECRET || 'secret123');
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: "Server error" });
    }
};
