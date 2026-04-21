const User = require('../models/user');

class UserRepository {
    async create(userData) {
        return await User.create(userData);
    }

    async findByEmail(email) {
        return await User.findOne({ where: { email } });
    }

    async findById(id) {
        return await User.findByPk(id);
    }

    // Admin-specific operations
    async update(id, updateData) {
        const user = await this.findById(id);
        if (!user) {
            return null;
        }
        return await user.update(updateData);
    }
    async delete(id) {
        const user = await this.findById(id);
        if (!user) {
            return null;
        }
        await user.destroy();
        return true;
    }

    async findAll() {
        return await User.findAll();
    }
}

module.exports = new UserRepository();