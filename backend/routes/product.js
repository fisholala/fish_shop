const express = require('express');
const router= express.Router()


const{getProducts, newProduct, getSingleProducts, updateProduct, deleteProduct, createProductReview, getProductReview,getAdminProducts, deleteReview}=require('../controller/productController')
const {isAuthenticatedUser,authorizeRoles}=require('../middleware/auth')

router.route('/products').get(getProducts)
router.route('/admin/products').get(getAdminProducts)
router.route('/product/:id').get(getSingleProducts)
router.route('/admin/product/new').post(isAuthenticatedUser,authorizeRoles('admin'),newProduct)
router.route('/admin/product/:id')
       .put(isAuthenticatedUser,authorizeRoles('admin'),updateProduct)
       .delete(isAuthenticatedUser,authorizeRoles('admin'),deleteProduct)
router.route('/review').put(isAuthenticatedUser,createProductReview)
router.route('/reviews').get(isAuthenticatedUser,getProductReview)
router.route('/reviews').delete(isAuthenticatedUser,deleteReview)

//  router.get('/products',getProducts)
module.exports = router