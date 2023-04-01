const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[20,'max of name is 20 char']
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail,'please enter the wright email']
    },
    passward:{
        type:String,
        required:[true,'enter the passward '],
        minlength:[6,'min character of passward is 6'],
        select:false
    },
    avatar:[
        {
        public_id:{
            type :String,
              required:true
        },
        url:{
            type:String,
              required:true
        }
    }],
    role:{
        type:String,
        default:'user'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    resetPasswardToken:String,
    resetPasswardExpire:Date
})
userSchema.pre('save',async function (next){
    if(!this.isModified("passward")){
        next()
    }
    this.passward=await bcrypt.hash(this.passward,10)
})

userSchema.methods.comparePassword=async function(enteredPassward) {
    return await bcrypt.compare(enteredPassward,this.passward)
}

userSchema.methods.getJwtToken= function () {
return jwt.sign({id:this._id},process.env.JWT_SECRET,{
    expiresIn:process.env.JWT_EXPIRES_TIME
})
}
userSchema.methods.getResetPasswardToken= function(){
    const resetToken=crypto.randomBytes(20).toString('hex') 

    this.resetPasswardToken=crypto.createHash('sha256').update(resetToken).digest('hex')

    this.resetPasswardExpire=Date.now() + 30 * 60 *  1000

    return resetToken
}



module.exports=mongoose.model('User',userSchema)