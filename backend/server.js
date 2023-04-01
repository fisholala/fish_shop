const app = require('./app');
// const express = require('express');
const connectDatabase = require('./config/database');
const dotenv = require('dotenv');
const { listen } = require('./app');
const cloudinary = require('cloudinary').v2

process.on('uncaughtException',err=>{
    console.log(`ERROR:${err.message}`)
    console.log('shutting down due to uncaught exceptions')
    process.exit(1)
})

// // Setting up config file
// if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })

 dotenv.config({path:'backend/config/config.env'})

connectDatabase()

cloudinary.config({
   
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
    cloud_name :process.env.CLOUDINARY_CLOUD_NAME
})

const server=app.listen(process.env.PORT,()=>{
    console.log(`server start on port: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)
})
process.on('unhandledRejection',err=>{
    console.log(`ERROR: ${err.stack}`)
    console.log('shutting down the server due to unhandled promise rejection')
    server.close(()=>{
        process.exit(1)
    })
})