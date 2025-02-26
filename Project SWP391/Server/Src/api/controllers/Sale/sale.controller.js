const Sale = require('../../models/sale')
const PaginationHelper = require('../../../helper/pagination')
const User = require('../../models/user')
const Product = require('../../models/product')

module.exports.getAllProductsWithSale = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments({ deleted: false });
        if (totalProducts === 0) {
            return res.status(404).json({ message: 'No products found.' });
        }

        const paginationData = await PaginationHelper({
                currentPage: req.query.page || 1,
                limit: req.query.limit || 12,
            },
            totalProducts,
            req.query
        );

        // Get products without populate to avoid schema mismatch errors
        const products = await Product.find({ deleted: false })
            .skip(paginationData.skip)
            .limit(paginationData.limit)
            .sort({ createdAt: -1 });

        // Get product IDs to fetch related sales
        const productIds = products.map(product => product._id);

        // Fetch active sales for these products
        const now = new Date();
        const activeSales = await Sale.find({
            productId: { $in: productIds },
            startDate: { $lte: now },
            endDate: { $gte: now }
        });

        // Create a map of productId to sale for quick lookup
        const salesMap = {};
        activeSales.forEach(sale => {
            salesMap[sale.productId.toString()] = {
                discount: sale.discountAmount,
                discountType: sale.discountType,
                startDate: sale.startDate,
                endDate: sale.endDate,
                salePrice: sale.salePrice || 
                  (sale.discountType === 'percentage' ? null : null) // This would need calculation based on product price
            };
        });

        // Add sale information to each product
        const productsWithSales = products.map(product => {
            const productObj = product.toObject();
            productObj.sale = salesMap[product._id.toString()] || null;
            return productObj;
        });

        res.status(200).json({
            products: productsWithSales,
            totalPage: paginationData.totalPage
        });
    } catch (error) {
        console.error('Error in getAllProductsWithSale:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



module.exports.addSale = async (req, res) => {
    try {
        const isSale = true;
        const { salePrice, startDate, endDate, discountType, discountAmount, minPurchase, productId } = req.body;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token is missing or invalid!' });
        }
        const sale = await User.findOne({ token: token });
        if (!sale || sale.role !== 'sale') {
            return res.status(401).json({ message: 'User not authorized to add sale or User not found!!!' });
        }

        const product = await Product.findOne({ _id: productId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const newSale = new Sale({
            isSale,
            salePrice,
            startDate,
            endDate,
            discountType,
            discountAmount,
            minPurchase,
            saleManager: sale._id
        })
        await newSale.save();
        res.status(200).json({ message: 'Sale created successfully.' })


    } catch (error) {
        res.status(500).json('Error creating new sale ' + error.message)
    }
}

module.exports.updateSale = async (req, res) => {
    try {
        const { id } = req.params;
        const { salePrice, startDate, endDate, discountType, discountAmount, minPurchase } = req.body;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token is missing or invalid!' });
        }
        const sale = await User.findOne({ token: token });
        if (!sale || sale.role !== 'sale') {
            return res.status(401).json({ message: 'User not authorized to update sale or User not found!!!' });
        }
    }
    catch (error) {
        res.status(500).json('Error updating sale ' + error.message)
    }
}

module.exports.deleteSale = async (req, res) => {
    try {
        const { id } = req.params;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Token is missing or invalid!' });
        }
        const sale = await User.findOne({ token: token });
        if (!sale || sale.role !== 'sale') {
            return res.status(401).json({ message: 'User not authorized to delete sale or User not found!!!' });
        }
        const deletedSale = await Sale.findByIdAndDelete(id);
        if (!deletedSale) {
            return res.status(404).json({ message: 'Sale not found.' })
        }
        res.status(200).json({ message: 'Sale deleted successfully.' })
    }
    catch (error) {
        res.status(500).json('Error deleting sale ' + error.message)
    }
}

module.exports.adminDelete = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSale = await Sale.findByIdAndDelete(id);
        if (!deletedSale) {
            return res.status(404).json({ message: 'Sale not found.' })
        }
        res.status(200).json({ message: 'Sale deleted successfully.' })
    }
    catch (error) {
        res.status(500).json('Error deleting sale ' + error.message)
    }
}