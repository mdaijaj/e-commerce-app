// require('dotenv').config();
const express= require('express')
const router=express()
const user= require('../controller/user.controller') 
const category= require('../controller/category.controller') 
const product= require('../controller/product.controller') 
const {login_required, isAdmin}= require('../middleware/index')


//users routes
router.post('/api/signup', user.signup);
router.post('/api/signin', user.signin)
router.get('/api/logout', login_required, user.logout) 
router.get('/api/profile_details/:id', login_required, user.profileDetails)
router.put('/api/update_details/:id', login_required, user.updateDetails)  
router.get('/api/allUsers',isAdmin, user.allUsers)


//category
router.post('/api/create_category', isAdmin, category.createCategory)
router.get('/api/getallcategory_list',login_required, category.getAllCategory)
router.get('/api/getdetails_category/:id',login_required, category.categoryDetails)


//product
router.post('/api/addproduct', isAdmin, product.addProduct)
router.put('/api/updateProductDetails/:id', isAdmin, product.updateProductDetails)
router.put('/api/deleteProductDetails/:id', isAdmin, product.deleteProductDetails)
router.get('/api/getall_product',login_required, product.getAllProducts)
router.get('/api/productDetails/:id',login_required, product.productDetails)


module.exports = router;
