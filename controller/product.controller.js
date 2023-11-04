
const Product = require('../model/product.schema');

const addProduct = async (req, res) => {
    try {
        const {
            product_name,
            description,
            price,
            stock,
            category_id,
        } = req.body;
        if (!product_name || !stock || !category_id) {
            return res.send({ message: "please fill all fields" })
        }
        let product_data = await Product.create({
            product_name,
            description,
            stock,
            price,
            category_id,
        })
        return res.status(201).send({
            message: "product add successfully",
            statusCode: 201,
            data: product_data,
        });
    }
    catch (err) {
        console.log(err.message)
        res.status(200).send({ message: "there is someting error..", error: err.message });
    }
}



const getAllProducts = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 5;
    try {
        const totalItems = await Product.countDocuments();
        const totalPages = Math.ceil(totalItems / pageSize);
        const product_data = await Product.find({isActive: true}).populate("category_id")
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        if (product_data) {
            return res.send({
                page,
                pageSize,
                totalItems,
                totalPages,
                message: "get all data sucessfully!",
                data: product_data,
            })
        } else {
            return res.send({ message: "data not found" })
        }
    }
    catch (err) {
        console.log(err.message)
    }
}


const productDetails = async (req, res) => {
    const productId = req.params.id
    try {
        const product_data = await Product.findById({ _id: productId })
        if (product_data) {
            console.log("product_data", product_data)
            return res.send({message: "get datails successfully!", data: product_data})
        }
    }
    catch (err) {
        console.log(err.message)
    }
}


const updateProductDetails = async (req, res) => {
    const productId = req.params.id
    const {
        product_name,
        description,
        stock,
        price,
        category_id
    } =req.body
    try {
        const product_data = await Product.updateOne({ _id: productId }, {
            $set: {
                product_name,
                description,
                stock,
                price,
                category_id,
            }
        })
        if (product_data) {
            console.log("product_data", product_data)
            return res.send({ message: "update successfully!", data: product_data })
        }
    }
    catch (err) {
        console.log(err.message)
    }
}


const deleteProductDetails = async (req, res) => {
    const productId = req.params.id
    try {
        const product_data = await Product.updateOne({ _id: productId }, {
            $set: {
                isActive: false
            }
        })
        if (product_data) {
            console.log("product_data", product_data)
            return res.send({ message: "update successfully!", data: product_data })
        }
    }
    catch (err) {
        console.log(err.message)
    }
}


module.exports = {
    addProduct,
    getAllProducts,
    productDetails,
    updateProductDetails,
    deleteProductDetails,
}
