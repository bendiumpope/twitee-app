import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const pass = process.env.JWT_SECRET;

export const generateToken = (user) => {
    
    const expires = process.env.JWT_EXPIRES_IN;
  return jwt.sign(user, pass, { expiresIn: expires });
};

export const decodeToken = (token) => {
    
    const decodedToken = jwt.verify(token, pass);

    return decodedToken;
}