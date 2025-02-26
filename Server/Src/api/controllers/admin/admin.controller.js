const User = require('../../models/user')
const PaginationHelper = require('../../../helper/pagination')
const Generate = require('../../../helper/generateRandom')
const bcrypt = require('bcrypt');
const saltRounds = 10;

//[GET]/api/admin/getAllUser
module.exports.getAllUser = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        if (totalUsers === 0) {
            return res.status(404).json({ message: 'No users found.' });
        }
        const currentPage = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;

        const paginationData = await PaginationHelper(
            {
                currentPage,
                limit
            },
            totalUsers,
            req.query
        );
        const users = await User.find()
            .skip(paginationData.skip)
            .limit(paginationData.limit)
            .sort({ createdAt: -1 });
        res.status(200).json({
            message: 'Users fetched successfully',
            users,
            totalPage: paginationData.totalPage,
            currentPage: paginationData.currentPage
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};


//[PUT]/api/admin/changeRole/:id
module.exports.changeRoleById = async (req, res) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token is missing or invalid!' });
        }

        const admin = await User.findOne({ token: token })
        if (!admin || admin.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized to change role or User not found!!!' });
        }


        const { id } = req.params
        const { newRole } = req.body
        const validRoles = ['admin', 'user', 'productManager', 'shipManager', 'saleManager'];
        if (!newRole || !validRoles.includes(newRole)) {
            return res.status(400).json({ message: `Invalid role! Allowed roles are: ${validRoles.join(', ')}` });
        }
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { role: newRole },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found!' });
        }

        res.status(200).json({
            code: 200,
            message: 'Role changed successfully!',
            user: updatedUser,
        });

    } catch (error) {
        res.status(500).json(error)
    }
}

//[PUT]/api/admin/changeStatus/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token is missing or invalid!' });
        }

        const admin = await User.findOne({ token: token })
        if (!admin || admin.role !== 'admin') {
            return res.status(401).json({ message: 'User not authorized to change status or User not found!!!' });
        }
        const { id } = req.params
        const { status } = req.body
        const user = await User.findByIdAndUpdate(id, { status: status }, { new: true })
        await user.save()
        res.status(200).json({ code: 200, message: 'Status changed successfully', user })
    } catch (error) {
        res.status(500).json({ code: 500, message: error.message })
    }
}

//[PUT]/api/admin/resetPassword/:id

module.exports.adminResetPassword = async (req, res) => {
    try {

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token is missing or invalid!' });
        }
        const admin = await User.findOne({ token });
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized! Only admin can reset passwords.' });
        }

        const { id } = req.params;

        const newPassword = Generate.generateString(8);
        const salt = await bcrypt.genSalt(saltRounds);
        const bcryptPass = await bcrypt.hash(newPassword, salt);

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { password: bcryptPass },
            { new: true }
        );


        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found!' });
        }

        res.status(200).json({
            code: 200,
            message: 'Password reset successfully!',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error resetting password:', error.message);
        res.status(500).json({
            code: 500,
            message: error.message || 'Internal server error',
        });
    }
};


//[DELETE]/api/admin/deleteUser/:id
module.exports.deleteUser = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token is missing or invalid!' });
        }
        const admin = await User.findOne({ token });
        if (!admin || admin.role !== 'admin') {
            return res.status(403).json({ message: 'Unauthorized! Only admin can delete users.' });
        }
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found!' });
        }
        res.status(200).json({
            code: 200,
            message: 'User deleted successfully!',
            user: deletedUser,
        });
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({
            code: 500,
            message: error.message || 'Internal server error',
        });
    }
};

//[search]/api/admin/searchUser
// [search]/api/admin/searchUser
module.exports.searchUser = async (req, res) => {
    try {
        const { search } = req.query;


        if (!search) {
            return res.status(400).json({
                code: 400,
                message: 'Search query is required!',
            });
        }

        // Tìm kiếm theo id (nếu `search` là ObjectId hợp lệ), username hoặc email
        const users = await User.find({
            $or: [
                { _id: mongoose.Types.ObjectId.isValid(search) ? search : null }, // Tìm theo ID nếu hợp lệ
                { username: { $regex: search, $options: 'i' } }, // Tìm kiếm theo username
                { email: { $regex: search, $options: 'i' } },   // Tìm kiếm theo email
            ],
        });

        res.status(200).json({
            code: 200,
            message: 'Users fetched successfully!',
            users,
        });
    } catch (error) {
        console.error('Error searching users:', error.message);
        res.status(500).json({
            code: 500,
            message: error.message || 'Internal server error',
        });
    }
};


//[Get]/api/admin/getUserByRole
module.exports.getUserByRole = async (req, res) => {
    try {
        const role = req.query.role;
        
        const users = await User.find({ role: role });
        if (!users) {
            return res.status(404).json({ message: 'No users found.' });
        }
        res.status(200).json({ users });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}