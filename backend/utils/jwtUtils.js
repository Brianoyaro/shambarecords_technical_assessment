const jwt = require('jsonwebtoken');

// generate token: id, role
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRY });
};
// validate token: verify signature, check expiry, extract payload
const validateToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return { valid: true, decoded };
    } catch (error) {
        return { valid: false, error };
    }
}
// decode token
const decodeToken = (token) => {
    try {
        const decoded = jwt.decode(token);
        return { valid: true, decoded };
    } catch (error) {
        return { valid: false, error };
    }
}

module.exports = {
    generateToken,
    validateToken,
    decodeToken
};