const express = require('express');

const app=express()
const cookieParser=require('cookie-parser')
const bodyParser = require('body-parser')
// const dotenv = require('dotenv');
const cors=require('cors')
const fileUpload = require('express-fileupload')
const errorMiddleware=require('./middleware/errors')
 const path = require('path')


// Setting up config file
if (process.env.NODE_ENV !== 'PRODUCTION') require('dotenv').config({ path: 'backend/config/config.env' })

// dotenv.config({path:'backend/config/config.env'})

app.use(cors())
app.use(express.json())

    app.use(bodyParser.urlencoded({ extended: true}));
    // app.use(bodyParser.json())
app.use(cookieParser())
app.use(fileUpload());

// app.use((req,res,next)=>{
//     header('Access-Control-Allow-Origin', "*");
//     header('Access-Control-Allow-Methods', 'POST,GET,DELETE,PUT,OPTIONS');
//     header("Access-Control-Allow-Headers", "Accept, Content-Type,Origin,X-Requested-With,Authorization");
// })






const products = require('./routes/product');
const auth = require('./routes/auth')
const payment = require('./routes/payment')
const order = require('./routes/order')

app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1', payment)
app.use('/api/v1', order)

if (process.env.NODE_ENV === 'PRODUCTION') {
    app.use(express.static(path.join(__dirname, '../frontend/build')))

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend/build/index.html'))
    })
}

app.use(errorMiddleware)

module.exports=app