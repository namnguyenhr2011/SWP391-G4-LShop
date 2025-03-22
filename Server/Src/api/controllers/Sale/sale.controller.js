const Sale = require('../../models/sale')
const PaginationHelper = require('../../../helper/pagination')
const User = require('../../models/user')
const Product = require('../../models/product')
const Transaction = require('../../models/transaction')


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

        const products = await Product.find({ deleted: false })
            .skip(paginationData.skip)
            .limit(paginationData.limit)
            .sort({ createdAt: -1 });

        const activeSales = await Sale.find({
            productId: { $in: products.map(product => product._id) },
        });

        const salesMap = {};
        activeSales.forEach(sale => {

            salesMap[sale.productId.toString()] = {
                saleID: sale._id,
                isSale: sale.isSale,
                discount: sale.salePrice,
                discountType: sale.discountType,
                startDate: sale.startDate,
                endDate: sale.endDate,
                salePrice: sale.salePrice,
            };
        });

        // Add sale information to each product
        const productsWithSales = products.map(product => {
            const productObj = product.toObject();
            // Assign sale information to product if exists
            productObj.sale = salesMap[product._id.toString()] || null;
            return productObj;
        });

        res.status(200).json({
            products: productsWithSales,
            totalPage: paginationData.totalPage
        });
    } catch (error) {
        console.error('Error in getAllProductsWithSaleId:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports.getProductWithSaleById = async (req, res) => {
    try {
        const { id } = req.params; // Lấy productId từ params

        // Kiểm tra xem productId có tồn tại không
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required.' });
        }

        // Tìm sản phẩm theo ID và populate subCategory
        const product = await Product.findOne({ _id: id, deleted: false })
            .populate('subCategory', 'name description')

        // Kiểm tra nếu không tìm thấy sản phẩm
        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }

        // Tìm thông tin sale liên quan đến sản phẩm này
        const sale = await Sale.findOne({ productId: id })

        // Kết hợp thông tin sản phẩm và sale để trả về
        res.status(200).json({
            product: {
                ...product.toObject(), // Chuyển đổi document thành object để thêm sale
                sale: sale ? sale.toObject() : null // Nếu không có sale thì trả về null
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports.addSalePrice = async (req, res) => {
    try {
        const isSale = true;
        const { salePrice, startDate, endDate, discountType, productId } = req.body;
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

        let finalSalePrice = salePrice;

        if (discountType === "percentage") {
            if (salePrice <= 0 || salePrice > 100) {
                return res.status(400).json({ message: 'Discount percentage must be between 1 and 100' });
            }
            finalSalePrice = product.price - (product.price * (salePrice / 100));
        }

        const newSale = new Sale({
            productId,
            isSale,
            salePrice: finalSalePrice,
            discountAmount: discountType === "percentage" ? (product.price * (salePrice / 100)) : salePrice, // Thêm discountAmount
            startDate,
            endDate,
            discountType,
            saleManager: sale._id
        });


        await newSale.save();

        // Cập nhật giá sản phẩm tạm thời
        await Product.updateOne({ _id: productId }, { $set: { salePrice: finalSalePrice, isSale: true } });

        // Tính thời gian chờ để xóa sale
        const timeUntilDeletion = new Date(endDate).getTime() - Date.now();
        if (timeUntilDeletion > 0) {
            setTimeout(async () => {
                await Sale.deleteOne({ _id: newSale._id });
                await Product.updateOne({ _id: productId }, { $unset: { salePrice: "" }, $set: { isSale: false } });
                console.log(`Sale ${newSale._id} has expired and removed from product.`);
            }, timeUntilDeletion);
        }

        res.status(200).json({
            message: 'Sale created successfully, will expire at ' + new Date(endDate).toLocaleString("vi-VN"),
            salePrice: finalSalePrice
        });

    } catch (error) {
        res.status(500).json('Error creating new sale ' + error.message);
    }
};



module.exports.updateSalePrice = async (req, res) => {
    try {
        const { saleId } = req.params; // Lấy saleId từ param
        const { productId, salePrice, startDate, endDate, discountType } = req.body; // Lấy các trường khác từ body

        console.log('Sale ID from param:', saleId); // Kiểm tra saleId
        console.log('Request body:', req.body); // Kiểm tra dữ liệu body

        // Kiểm tra token và quyền truy cập
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token is missing or invalid!' });
        }

        const saleUser = await User.findOne({ token: token });
        if (!saleUser || saleUser.role !== 'sale') {
            return res.status(401).json({ message: 'User not authorized to update sale or User not found!!!' });
        }

        // Kiểm tra sản phẩm
        const product = await Product.findOne({ _id: productId });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Kiểm tra sale có tồn tại không
        const existingSale = await Sale.findOne({ _id: saleId, productId: productId });
        if (!existingSale) {
            return res.status(404).json({ message: 'Sale not found for this product' });
        }

        // Tính toán giá sale cuối cùng
        let finalSalePrice = salePrice;
        if (discountType === "percentage") {
            if (salePrice <= 0 || salePrice > 100) {
                return res.status(400).json({ message: 'Discount percentage must be between 1 and 100' });
            }
            finalSalePrice = product.price - (product.price * (salePrice / 100));
        }

        // Cập nhật sale
        const updatedSale = await Sale.updateOne(
            { _id: saleId },
            {
                $set: {
                    salePrice: finalSalePrice,
                    startDate,
                    endDate,
                    discountType,
                    discountAmount: discountType === "percentage" ? (product.price * (salePrice / 100)) : salePrice,
                },
            }
        );

        if (updatedSale.nModified === 0) {
            return res.status(400).json({ message: 'No changes were made to the sale' });
        }

        // Cập nhật sản phẩm
        await Product.updateOne(
            { _id: productId },
            { $set: { salePrice: finalSalePrice, isSale: true } }
        );

        // Đặt lịch xóa sale khi hết hạn
        const timeUntilDeletion = new Date(endDate).getTime() - Date.now();
        if (timeUntilDeletion > 0) {
            setTimeout(async () => {
                await Sale.deleteOne({ _id: saleId });
                await Product.updateOne(
                    { _id: productId },
                    { $unset: { salePrice: "" }, $set: { isSale: false } }
                );
                console.log(`Sale ${saleId} has expired and removed from product.`);
            }, timeUntilDeletion);
        }

        // Trả về kết quả
        res.status(200).json({
            message: 'Sale updated successfully, will expire at ' + new Date(endDate).toLocaleString("vi-VN"),
            salePrice: finalSalePrice,
        });
    } catch (error) {
        console.error('Error updating sale:', error);
        res.status(500).json({ message: 'Error updating sale: ' + error.message });
    }
};

module.exports.deleteSale = async (req, res) => {
    try {
        const { id } = req.params;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token is missing or invalid!' });
        }

        const saleUser = await User.findOne({ token: token });
        if (!saleUser || saleUser.role !== 'sale') {
            return res.status(401).json({ message: 'User not authorized to delete sale or User not found!!!' });
        }

        const sale = await Sale.findById(id);
        if (!sale) {
            return res.status(404).json({ message: 'Sale not found' });
        }

        await Sale.deleteOne({ _id: id });
        await Product.updateOne(
            { _id: sale.productId },
            { $unset: { salePrice: "" }, $set: { isSale: false } }
        );

        res.status(200).json({
            message: `Sale with ID ${id} has been deleted successfully`,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting sale: ' + error.message });
    }
};


module.exports.getAllProductsWithSaleID = async (req, res) => {
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

        const products = await Product.find({ deleted: false })
            .skip(paginationData.skip)
            .limit(paginationData.limit)
            .sort({ createdAt: -1 });

        const activeSales = await Sale.find({
            productId: { $in: products.map(product => product._id) },
        });

        const salesMap = {};
        activeSales.forEach(sale => {

            salesMap[sale.productId.toString()] = {
                saleID: sale._id,
                isSale: sale.isSale,
                discount: sale.salePrice,
                discountType: sale.discountType,
                startDate: sale.startDate,
                endDate: sale.endDate,
                salePrice: sale.salePrice,
            };
        });

        // Add sale information to each product
        const productsWithSales = products.map(product => {
            const productObj = product.toObject();
            // Assign sale information to product if exists
            productObj.sale = salesMap[product._id.toString()] || null;
            return productObj;
        });

        res.status(200).json({
            products: productsWithSales,
            totalPage: paginationData.totalPage
        });
    } catch (error) {
        console.error('Error in getAllProductsWithSaleId:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports.getAllOrderBySaleId = async (req, res) => {
    try {
      const { saleId } = req.params; // Lấy saleId từ params
      const { status } = req.body; // Lấy trạng thái mới từ body (nếu cần update)
  
      // Tìm SaleClaim theo saleId
      const saleClaim = await SaleClaim.findOne({ salerId: saleId }).populate('orderIds');
      
      if (!saleClaim) {
        return res.status(404).json({ message: "SaleClaim not found" });
      }
  
      // Trả về danh sách orderIds
      const orderIds = saleClaim.orderIds;
  
      // Nếu có status trong body, update trạng thái cho tất cả orders
      if (status) {
        await Order.updateMany(
          { _id: { $in: orderIds } },
          { $set: { status: status } }
        );
      }
  
      return res.status(200).json({
        message: "Orders retrieved successfully",
        orders: orderIds,
      });
  
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };

  module.exports.updateOrderStatusBySaleId = async (req, res) => {
    try {
      const { saleId } = req.params; // Lấy saleId từ params
      const { status } = req.body; // Lấy status từ body
  
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
  
      // Tìm SaleClaim theo saleId
      const saleClaim = await SaleClaim.findOne({ salerId: saleId });
      if (!saleClaim) {
        return res.status(404).json({ message: "SaleClaim not found" });
      }
  
      // Cập nhật trạng thái cho tất cả orders trong saleClaim
      await Order.updateMany(
        { _id: { $in: saleClaim.orderIds } },
        { $set: { status } }
      );
  
      return res.status(200).json({ message: "Order statuses updated successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
