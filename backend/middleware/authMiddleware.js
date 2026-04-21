const userRepository = require('../repository/userRepository');
const AppError = require('../utils/appError');
const { validateToken } = require('../utils/jwtUtils');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new AppError('Authorization header missing', 401);
    }

    const token = authHeader.startsWith('Bearer ')
      ? authHeader.slice(7)
      : authHeader;

    // console.log(`Received token: ${token}`);

    const decoded = validateToken(token);

    // console.log(`Decoded token: ${JSON.stringify(decoded.id)}`);
    // console.log(`typeof decoded.id.id: ${typeof decoded.id.id}`);

    if (!decoded) {
      throw new AppError('Invalid or expired token', 401);
    }

    const user = await userRepository.findById(decoded.id.id);
    req.user = user;
    // console.log(`Authenticated user: ${JSON.stringify(req.user)}`);
    next();
  } catch (error) {
    if (error instanceof AppError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }
    res.status(401).json({
      status: 'error',
      message: 'Authentication failed',
    });
  }
};

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        throw new AppError('User not authenticated', 401);
      }

      if (!allowedRoles.includes(req.user.role)) {
        // console.log(`User role: ${req.user.role}, Allowed roles: ${allowedRoles}`);
        throw new AppError('Access denied. Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({
          status: 'error',
          message: error.message,
        });
      }
      res.status(403).json({
        status: 'error',
        message: 'Authorization failed',
      });
    }
  };
};

module.exports = { authMiddleware, authorize };
