
const Category = require('../model/category.schema');

const createCategory = async (req, res) => {
    console.log("api is working.")
    try {
        const {
            category_name,
            description
        } = req.body;
        if (!category_name) {
            return res.send({ message: "please fill all fields" })
        }
        let categoryData = await Category.create({
            category_name,
            description
        })
        return res.status(201).send({
            message: "crated category successfully",
            statusCode: 200,
            data: categoryData,
        });
    }
    catch (err) {
        console.log(err.message)
        res.status(200).send({ message: "there is someting error..", error: err.message });
    }
}


const getAllCategory = async (req, res) => {
    try {
        const product_data = await Category.find()
        if (product_data.length > 0) {
            return res.send({ message: "get all data sucessfully!", data: product_data })
        } else {
            return res.send({ message: "data not found" })
        }
    }
    catch (err) {
        console.log(err.message)
    }
}


const categoryDetails = async (req, res) => {
    cat_id=req.params.id
    try {
        const category_Data = await Category.findById({_id:cat_id })
        if (category_Data) {
            console.log("category_Data", category_Data)
            return res.send({data: category_Data, message: "category deails successfully!"})
        }
    }
    catch (err) {
        console.log(err.message)
    }
}

module.exports = {
    createCategory,
    getAllCategory,
    categoryDetails
}
