const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwtUtils');
const userRepository = require('../repository/userRepository');
const AppError = require('../utils/appError');
const UserEnum = require('../enums/userEnum');

class AuthService {
    async register(username, email, password) {
        // Check if user already exists
        console.log(`Received registration request: username=${username}, email=${email}`);
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new AppError('Email is already registered', 400);
        }

        // Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create the user
        const newUser = await userRepository.create({
            username,
            email,
            passwordHash,
            role: UserEnum.ROLE.USER, // Default role
            status: UserEnum.STATUS.ACTIVE, // Default status
        });

        return {
            id: newUser.id,
            username: newUser.username,
            email: newUser.email
        };
    }

    async login(email, password) {
        // Find user by email
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }
        // confirm user is active
        if (user.status !== UserEnum.STATUS.ACTIVE) {
            throw new AppError('User account is inactive', 403);
        }

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        // Generate JWT token
        const token = generateToken({ id: user.id, role: user.role });

        return {
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        };
    }

    async createAdminUser(username, email, password) {
        // Check if user already exists
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            throw new AppError('Email is already registered', 400);
        }

        // Hash the password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // Create the admin user
        const newAdminUser = await userRepository.create({
            username,
            email,
            passwordHash,
            role: UserEnum.ROLE.ADMIN, // Admin role
            status: UserEnum.STATUS.ACTIVE, // Default status
        });
        
        return {
            id: newAdminUser.id,
            username: newAdminUser.username,
            email: newAdminUser.email,
            role: newAdminUser.role,
            status: newAdminUser.status
        };
    }

    async deactivateUser(userId) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        await userRepository.update(userId, { status: UserEnum.STATUS.INACTIVE });
        return { message: 'User deactivated successfully' };
    }

    async activateUser(userId) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        await userRepository.update(userId, { status: UserEnum.STATUS.ACTIVE });
        return { message: 'User activated successfully' };
    }

    async deleteUser(userId) {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new AppError('User not found', 404);
        }

        await userRepository.delete(userId);
        return { message: 'User deleted successfully' };
    }

    async getAllUsers() {
        const users = await userRepository.findAll();
        return users.map(user => ({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            status: user.status
        }));
    }

}

module.exports = new AuthService();