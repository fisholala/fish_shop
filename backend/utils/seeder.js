const product = require('../models/product');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');
const products=require('../data/product')
const{connect}=require('mongoose')
dotenv.config({path:'backend/config/config.env'})

connectDatabase()
const seedProducts=async()=>{
    try {
        await product.deleteMany()
        console.log('products are deleted')
        await product.insertMany(products)
        console.log('product are added')
        process.exit()
    } catch (error) {
        console.log(error.message)
        process.exit()
    }
}
seedProducts()