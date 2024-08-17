import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    const secret = process.env.JWT_SECRET || "default_secret";
    return jwt.sign({ id: userId }, secret, {
        expiresIn: '1h', 
    });
};

export default generateToken;
