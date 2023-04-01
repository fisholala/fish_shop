const mongoose = require('mongoose');

const productSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,'please enter the name'],
        trim:true,
        maxLength:[100,'connot exceed 100']
    },
    price:{
        type:Number,
        required:[true,'please enter the price'],
        maxLength:[6,'connot exceed 6 characters']
    },
    description:{
        type:String,
        required:[true,'please enter the description'],
    },
    ratings:{
        type:Number,
        default:0
    },
    images:[
        {
            public_id:{
                type:String,
                 required:true
            },
            url:{
                type:String,
                 required:true  
            },
        }
    ],
    category:{
        type:String,
        required:[true,'please enter the catagory'],
        enum:{
            values:[
               
                    'Electronics',
                    'Cameras',
                    'Laptops',
                    'Accessories',
                    'Headphones',
                    'Food',
                    "Books",
                    'Clothes/Shoes',
                    'Beauty/Health',
                    'Sports',
                    'Outdoor',
                    'Home'
                
            
            ],
            message:'please enter the correct catagory'
        }
    },
seller:{
        type:String,
        required:[true,'please enter the seller'],
    },
    stock:{
        type:Number,
        required:[true,'please enter the stoke'],
        maxLength:[6,'connot exceed 6 characters'],
        default:0
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        { 
             user:{
            type:mongoose.Schema.ObjectId,
            ref:'User',
            required:true
        },
         name:{
        type:String,
        required:true
        },
        rating:{
            type:Number,
            required:true
         },
        comment:{
            type:String,
            required:true
          },
        }
    ],
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    createAt:{
        type:Date,
        default:Date.now
    }
})
module.exports=mongoose.model('Product',productSchema)