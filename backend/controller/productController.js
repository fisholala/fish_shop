const Product = require("../models/product")
const express=require('express')
const { default: mongoose } = require('mongoose')
const ErrorHandler=require('../utils/errorhandler').default
const catchAsyncErrors=require('../middleware/catchAsyncErrors')
const APIFeatures=require('../utils/APIFeatures')
const cloudinary=require('cloudinary')

exports.getProducts=async(req,res,next)=>{

//    return next(new ErrorHandler('My error',400))

    const resPerPage=4
  const productsCount=await Product.countDocuments()
   
  const apiFeatures=new APIFeatures(Product.find(),req.query)
   .search()
   .filter()
   
   let products= await apiFeatures.query
   let filteredProductsCount=products.length

       apiFeatures.pagination(resPerPage)
          products= await apiFeatures.query

    // const products= await Product.find()
    res.status(200).json({
        success:true,
        productsCount,
        resPerPage,
        filteredProductsCount,
        products
        // message:'this route will show all product in data base'
    })
}

// Create new product   =>   /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {

    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }

    let imagesLinks = [];

    for (let i = 0; i<images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})


exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {

    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })

})

exports.getSingleProducts=catchAsyncErrors(async(req,res,next)=>{
    const {id}=req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
        // return res.status(404).json({error:'no such workout'})
        return next(new ErrorHandler('product not found',404))
      }
    const product=await Product.findById(id)

    if(!product){
          res.status(404).json({
            success:false,
            message:'product not found'
        })
    }{
    res.status(200).json({
        success:true,
        product
    })
}
})
exports.updateProduct=catchAsyncErrors(async(req,res,next)=>{

    let product = await Product.findById(req.params.id)
    if( !product ){
        // return res.status(404).json({
        //     success:false,
        //     message:'product not found'
        // })
        return next(new ErrorHandler('product not found',404))
    }
    let images = []
    if (typeof req.body.images === 'string') {
        images.push(req.body.images)
    } else {
        images = req.body.images
    }
    if(images !== undefined){

        for(let i=0; i<product.images.length;i++){
            const result=await cloudinary.v2.uploader.destroy( product.images[i].public_id)
        }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
        const result = await cloudinary.v2.uploader.upload(images[i], {
            folder: 'products'
        });

        imagesLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.images = imagesLinks
}
    product=await Product.findByIdAndUpdate(req.params.id, req.body,{
       new:true,
       runValidators:true,
       useFindAndModify:false 
    })
    res.status(200).json({
        success:true,
        product
    })
})
exports.deleteProduct=catchAsyncErrors(async(req,res,next)=>{

    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    // Deleting images associated with the product
    for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id)
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: 'Product is deleted.'
    })

})

exports.createProductReview=catchAsyncErrors(async(req,res,next)=>{ 

    const{rating,comment,productId}=req.body

    const review={
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }
    const product=await Product.findById(productId)
      
    const isReviewed=product.reviews.find(r => r.user.toString() === req.user._id.toString())

    if(isReviewed){
         product.reviews.forEach(review=>{
            if(review.user.toString() === req.user._id.toString()){
                review.comment=comment
                review.rating=rating
            }
         })
    }else{
        product.reviews.push(review)
        product.numOfReviews=product.reviews.length 
    }
    product.ratings=product.reviews.reduce((acc, item) => item.rating + acc,0)/ product.reviews.length
 
    await product.save({validateBeforeSave:false})
    
    res.status(200).json({
        success:true,
       
    })
})  
exports.getProductReview=catchAsyncErrors(async(req,res,next)=>{
      const product=await Product.findById(req.query.id)
      res.status(200).json({
        success:true,
        reviews:product.reviews
       
    })
}) 
exports.deleteReview=catchAsyncErrors(async(req,res,next)=>{
    const product=await Product.findById(req.query.productId)
const reviews= product.reviews.filter(review => review._id.toString() !== req.query.id.toString())
   
const numOfReviews=reviews.length
const ratings=product.reviews.reduce((acc,item)=> item.rating + acc,0)/reviews.length

await Product.findByIdAndUpdate(req.query.productId,{
    reviews,
    ratings,
    numOfReviews
}, {
    new:true,
    runValidators:true,
    useFindAndModify:false
})

    res.status(200).json({
      success:true,
     
     
  })
}) 

 