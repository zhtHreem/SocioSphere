import jwt from 'jsonwebtoken';

// Generate a JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email,role:user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Verify a JWT token
const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

export  { generateToken, verifyToken };
