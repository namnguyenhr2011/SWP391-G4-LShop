const Discount = require('../../models/discount');
const UserDiscount = require('../../models/userDiscounts');
const User = require('../../models/user');


module.exports.getAllDiscount = async (req, res) => {
    try {
        const discounts = await Discount.find({});
        res.status(200).json(discounts);
    } catch (error) {
        res.status(500).json(error);
    }
}


module.exports.createDiscount = async (req, res) => {
    try {
        const { discountType, discountValue } = req.body;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token is missing or invalid!' });
        }
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(401).json({ message: 'User not found!' });
        }
        if (user.role !== 'admin') {
            return res.status(401).json({ message: 'You are not authorized to create a discount!' });
        }
        const discount = await Discount.create({ discountType, discountValue });
        res.status(200).json(discount);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports.updateDiscount = async (req, res) => {
    try {
        const { discountType, discountValue } = req.body;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        const discountId = req.params;

        if (!token) {
            return res.status(401).json({ message: 'Token is missing or invalid!' });
        }
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(401).json({ message: 'User not found!' });
        }
        if (user.role !== 'admin') {
            return res.status(401).json({ message: 'You are not authorized to update a discount!' });
        }
        const discount = await Discount.findByIdAndUpdate(discountId, { discountType, discountValue }, { new: true });
        res.status(200).json(discount);
    } catch (error) {
        res.status(500).json(error);
    }

}

module.exports.deleteDiscount = async (req, res) => {
    try {
        const { discountId } = req.params;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token is missing or invalid!' });
        }
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(401).json({ message: 'User not found!' });
        }
        if (user.role !== 'admin') {
            return res.status(401).json({ message: 'You are not authorized to delete a discount' });
        }
        await Discount.findByIdAndDelete(discountId);
        res.status(200).json({ message: "Delete discount successfully" });
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports.assignDiscount = async (req, res) => {
    try {
        const { discountId } = req.params;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token is missing or invalid!' });
        }
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(401).json({ message: 'User not found!' });
        }
        const discount = await Discount.findById(discountId);
        if (!discount) {
            return res.status(404).json({ message: 'Discount not found!' });
        }
        const userDiscount = await UserDiscount.create({ userId: user._id, discountId: discount._id });
        res.status(200).json(userDiscount);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports.getUserDiscount = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token is missing or invalid!' });
        }
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(401).json({ message: 'User not found!' });
        }
        const userDiscount = await UserDiscount.find({ userId: user._id });
        res.status(200).json(userDiscount);
    } catch (error) {
        res.status(500).json(error);
    }
}

