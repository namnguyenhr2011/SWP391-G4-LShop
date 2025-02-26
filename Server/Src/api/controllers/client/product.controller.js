const Product = require('../../models/product')
const PaginationHelper = require('../../../helper/pagination')
const User = require('../../models/user')
const Category = require('../../models/category')
const SubCategory = require('../../models/subCategory')


//[Post] api/products/addProducts
module.exports.addProduct = async (req, res) => {
    try {
        const { subcategoryId } = req.params;
        const { name, price, image, description, quantity, sold, saleOf, salePrice } = req.body;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];


        if (!token) {
            return res.status(401).json({ message: 'Token is missing or invalid!' });
        }

        const productManager = await User.findOne({ token });
        if (!productManager || productManager.role !== 'productManager') {
            return res.status(401).json({ message: 'User not authorized to add product or User not found!!!' });
        }

        const subcategoryDoc = await SubCategory.findOne({ _id: subcategoryId });
        if (!subcategoryDoc) {
            return res.status(400).json({
                message: 'SubCategory not found!'
            });
        }

        const existingProduct = await Product.findOne({ name });
        if (existingProduct) {
            return res.status(400).json({ message: 'Product with this name already exists!' });
        }

        const product = new Product({
            productManager: productManager._id,
            name,
            price,
            image,
            description,
            subCategory: subcategoryDoc._id,
            quantity,
            sold,
            saleOf,
            salePrice
        });

        await product.save();

        res.status(201).json({ message: 'Product created successfully', product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating product: ' + err.message });
    }
};


//[Put] api/products/updateProduct/:id
module.exports.updateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const { name, price, image, description, subCategory, quantity, sold, saleOf, salePrice } = req.body;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token is missing or invalid!' });
        }

        const productManager = await User.findOne({ token });
        if (!productManager || productManager.role !== 'productManager') {
            return res.status(401).json({ message: 'User not authorized to update product or User not found!' });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found!' });
        }

        const subCategoryDoc = await SubCategory.findById(subCategory);
        if (!subCategoryDoc) {
            return res.status(400).json({ message: 'SubCategory not found!' });
        }

        product.name = name || product.name;
        product.price = price || product.price;
        product.image = image || product.image;
        product.description = description || product.description;
        product.subCategory = subCategory || product.subCategory;
        product.quantity = quantity || product.quantity;
        product.sold = sold || product.sold;
        product.saleOf = saleOf || product.saleOf;
        product.salePrice = salePrice || product.salePrice;

        await product.save();

        return res.status(200).json({ message: 'Product updated successfully', product });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error updating product: ' + err.message });
    }
};


//[Delete] api/products/managerDelete/:id
module.exports.managerDeleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Token is missing or invalid!' });
        }
        const productManager = await User.findOne({ token: token });
        if (!productManager || productManager.role !== 'productManager') {
            return res.status(401).json({ message: 'User not authorized to delete product or User not found!!!' });
        }
        const deleteProduct = await Product.findByIdAndDelete(id);
        if (!deleteProduct) {
            return res.status(404).json({ message: 'Product not found.' })
        }
        res.status(200).json({ message: 'Product deleted successfully.' })

    } catch (error) {
        res.status(500).json(`Delete product error: ` + error.message)
    }
}

//[Delete] api/products/adminDelete

module.exports.adminDeleteProduct = async (req, res) => {
    try {
        const { id } = req.params.id;
        const deleteProduct = await Product.findByIdAndDelete(id);
        if (!deleteProduct) {
            return res.status(404).json({ message: 'Product not found.' })
        }
        res.status(200).json({ message: 'Product deleted successfully.' })
    } catch (error) {
        res.status(500).json(`Delete product error: ` + error.message)
    }
}

// [GET] api/products/search?query=
module.exports.searchProducts = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name && !description) {
            return res.status(400).json({ message: 'Please provide a valid name or description to search.' });
        }

        let productsQuery = {
            deleted: false
        };

        if (name) {
            productsQuery.name = { $regex: name, $options: "i" };
        }

        if (description) {
            productsQuery.description = { $regex: description, $options: "i" };
        }

        const totalProducts = await Product.countDocuments(productsQuery);

        if (totalProducts === 0) {
            return res.status(404).json({ message: 'No products found.' });
        }

        const paginationData = await PaginationHelper(
            {
                currentPage: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 12
            },
            totalProducts,
            req.query
        );

        const products = await Product.find(productsQuery)
            .skip(paginationData.skip)
            .limit(paginationData.limit)
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: 'Products found',
            products,
            totalPage: paginationData.totalPage,
            currentPage: paginationData.currentPage
        });
    } catch (error) {
        res.status(500).json({ message: `Search product error: ${error.message}` });
    }
};


// [GET] api/products/getAllProducts
module.exports.getAllProducts = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments({ deleted: false })
        if (totalProducts === 0) {
            return res.status(404).json({ message: 'No products found.' })
        }
        const paginationData = await PaginationHelper({
            currentPage: 1,
            limit: 12,
        },
            totalProducts,
            req.query
        )
        const products = await Product.find({ deleted: false })
            .skip(paginationData.skip)
            .limit(paginationData.limit)
            .sort({ createdAt: -1 })

        res.status(200).json({
            products,
            totalPage: paginationData.totalPage
        })
    } catch (error) {
        res.status(500).json(error)
    }
}


// [GET] api/products/:id
module.exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Please provide a product id.' });
        }

        const product = await Product.findByIdAndUpdate(
            id,
            { $inc: { numReviews: 1 } },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found.' });
        }
        res.status(200).json({
            product,
            message: 'Product found',
        });
    } catch (error) {
        res.status(500).json({
            error: error.message || 'An error occurred while fetching the product.',
        });
    }
};


// [GET] api/products/getProductByCategory/category
module.exports.getProductByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        if (!category) {
            return res.status(400).json({ message: 'Please provide a category.' })
        }

        const categories = await Category.findOne({ name: category });
        if (!categories) {
            return res.status(404).json({ message: 'Category not found.' })
        }
        const totalProducts = await Product.countDocuments({
            category: categories._id,
            deleted: false
        })
        if (totalProducts === 0) {
            return res.status(404).json({ message: 'No products found.' })
        }
        const paginationData = await PaginationHelper({
            currentPage: 1,
            limit: 12,
        },
            totalProducts,
            req.query
        );

        const products = await Product.find({ category: categories._id })
            .skip(paginationData.skip)
            .limit(paginationData.limit)
            .sort({ createdAt: -1 });
        if (!products || products === null) {
            return res.status(404).json({ message: 'Product not found.' })
        }
        res.status(200).json({
            products,
            totalPage: paginationData.totalPage
        })
    } catch (error) {
        res.status(500).json(error)
    }
}


//[GET] api/product/getProductBySubCategory/subcategory
module.exports.getProductBySubCategory = async (req, res) => {
    try {
        const { subcategoryId } = req.params;
        const subcategoryDoc = await SubCategory.findOne({ _id: subcategoryId });

        if (!subcategoryDoc) {
            return res.status(400).json({ code: 400, message: 'Please provide a subcategory.' })
        }

        const products = await Product.find({ subCategory: subcategoryDoc._id, deleted: false }).populate('subCategory', 'name');

        if (products.length === 0) {
            return res.status(404).json({ message: `No products found under SubCategory: ${subcategoryId}` });
        }

        res.status(200).json({
            products,
            message: `Products under SubCategory: ${subcategoryId}`
        })
    } catch (error) {
        res.status(500).json(error)
    }
}

//[GET] api/product/getTop8
module.exports.getTop8 = async (req, res) => {
    try {
        const products = await Product.find({ deleted: false }).sort({ rating: -1 }).limit(8);
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json(error);
    }
}

//[GET] api/getTopView
module.exports.getTopView = async (req, res) => {
    try {
        const products = await Product.find({ deleted: false }).sort({ numReviews: -1 }).limit(8);
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json(error);
    }
}


//[GET] api/products/getTopSold
module.exports.getTopSold = async (req, res) => {
    try {
        const products = await Product.find({ deleted: false }).sort({ numSold: -1 }).limit(8);
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json(error);
    }
}