import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 
import User from '../models/user.model.js';

const login = async (req, res) => {
    try {
        const { name, password } = req.body;
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2d' });
        return res.status(200).json({ success : true , message: "login successful", token, user: { id: user._id, name: user.name, role: user.role } });
    }
    catch (error) {
        console.error('Login error:', error.message);
        return res.status(500).json({ message: 'Server error' });
    }
}
export { login };