const User =require('../models/user')
const ErrorHandler=require('../utils/errorhandler')
const catchAsyncErrors=require('../middleware/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
//  const cloudinary = require('../middleware/cloudinary');
// const upload=require('../middleware/multer')
 const cloudinary = require('cloudinary');

exports.registerUser = catchAsyncErrors(async (req, res, next) => {

    // const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //     // upload_preset: 'dev_setups',
    //     folder:'avatars',
    //      width: 150,
    //      crop: "scale"
    // })

    // const { name, email, passward } = req.body;

    // const user = await User.create({
    //     name,
    //     email,
    //     passward,
    //     avatar: {
    //         public_id: result.public_id,
    //         url: result.secure_url
    //     }
    // })

    // sendToken(user, 200, res)

    let avatar = []
    if (typeof req.body.avatar === 'string') {
        avatar.push(req.body.avatar)
    } else {
        avatar = req.body.avatar
    }

    let avatarLinks = [];

    for (let i = 0; i<avatar.length; i++) {
        const result = await cloudinary.v2.uploader.upload(avatar[i], {
            folder: 'avatars'
        });

        avatarLinks.push({
            public_id: result.public_id,
            url: result.secure_url
        })
    }

    req.body.avatar = avatarLinks
    // req.body.user = req.user.id;

    const user = await User.create(req.body);

    res.status(201).json({
        success: true,
         user
    })

})
exports.loginUser=catchAsyncErrors(async(req,res,next)=>{
     
    const{ email,passward}= req.body;
    if(!email || !passward){
        return next(new ErrorHandler('please enter email and passward',400))
        
    }
    const user=await User.findOne({email}).select('+passward')
    if(!user){
        return next(new ErrorHandler('Invalid email or passward',401))
    }
   const isPasswardMatched= await user.comparePassword(passward)
    if(!isPasswardMatched){
        return next(new ErrorHandler('Invalid email or passward',401))
    }
   
   sendToken(user,200,res)
    // const token= user.getJwtToken()

    // res.status(201).json({
    //     success:true,
    //     token
    //     // user
    //  })
})

exports.getUserProfile=catchAsyncErrors(async(req,res,next)=>{
const user= await User.findById(req.user.id)

res.status(200).json({
    success:true,
    user
})
})
exports.updatePassward=catchAsyncErrors(async(req,res,next)=>{

    const user=await User.findById(req.user.id). select('+passward')
    const isMatch=await user.comparePassword(req.body.oldPassward)
    if(!isMatch){
        return next(new ErrorHandler('old passwaord is incorrect',400))
    }
    user.passward=req.body.passward
    await user.save()
    sendToken(user,200,res)
})

exports.updateProfile=catchAsyncErrors(async(req,res,next)=>{

let user = await User.findById(req.params.id)

if( !user ){
    return next(new ErrorHandler('user not found',404))
}

let avatar = []
if (typeof req.body.avatar === 'string') {
    avatar.push(req.body.avatar)
} else {
    avatar = req.body.avatar
}
if(avatar !== undefined){

    for(let i=0; i<user.avatar.length;i++){
        const result=await cloudinary.v2.uploader.destroy( user.avatar[i].public_id)
    }

let avatarLinks = [];

for (let i = 0; i < avatar.length; i++) {
    const result = await cloudinary.v2.uploader.upload(avatar[i], {
        folder: 'users'
    });

    avatarLinks.push({
        public_id: result.public_id,
        url: result.secure_url
    })
}

req.body.avatar = avatarLinks
}
user=await User.findByIdAndUpdate(req.params.id, req.body,{
   new:true,
   runValidators:true,
   useFindAndModify:false 
})
res.status(200).json({
    success:true,
    user
})
})

exports.forgot=catchAsyncErrors(async(req,res,next)=>{

    const user=await User.findOne({email:req.body.email})

    if(!user){
        return next(new ErrorHandler('user not found with this email',404))  
    }
    const resetToken=user.getResetPasswardToken()
    await user.save({validateBeforeSave:false})

    // ${req.protocol}://

    // const resetUrl=`${req.get('host')}/api/v1/passward/reset/${resetToken}`; 

    // const resetUrl=`${process.env.FRONTEND_URI}/passward/reset/${resetToken}`; 
     
    // Create reset password url
 const resetUrl =`${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;

    const message=`your password reset is as follows:\n\n${resetUrl}\n\nif you not request this email,then ignore it.`
  
    try {
        await sendEmail({
            email:user.email,
            subject:'shopit password recovery',
            message
        })
        res.status(200).json({
            success:true,
            message:`email sent to:${user.email}`
        })
        
    } catch (error) {
         user.resetPasswardToken=undefined
        user.resetPasswardExpire=undefined
        
    await user.save({validateBeforeSave:false}) 
    return next(new ErrorHandler(error.message,500)) 
    }


})

exports.resetPassward=catchAsyncErrors(async(req,res,next)=>{ 
    const resetPasswardToken=crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswardToken,  
        resetPasswardExpire:{$gt:Date.now()}
    })
if(!user){
    return next(new ErrorHandler('password reset is invalid or expired',400))  
}
if(req.body.passward !== req.body.confirmPassward){
    return next(new ErrorHandler('password does not match',400))  
}
   
user.passward=req.body.passward

user.resetPasswardToken=undefined;  
user.resetPasswardExpire=undefined
await user.save()
sendToken(user,200,res)
})

exports.logout=catchAsyncErrors(async(req,res,next)=>{
  res.cookie('token',null,{
    expires:new Date(Date.now()),
    httpOnly:true
  })
  res.status(200).json({
    success:true,
    message:'Logged out'
  })
})
exports.allUsers=catchAsyncErrors(async(req,res,next)=>{
    const users=await User.find()

    res.status(200).json({
        success:true,
        users
    })
})
exports.getUserDetails=catchAsyncErrors(async(req,res,next)=>{
    const user=await User.findById(req.params.id)
    if(!user){
        return next(new ErrorHandler(`this user is not exist with ${req.params.id}`))
    }
    res.status(200).json({
        success:true,
        user
    })
})
exports.updateUserProfile=catchAsyncErrors(async(req,res,next)=>{
    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
    
    const user=await User.findByIdAndUpdate(req.params.id, newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
    res.status(200).json({
        success:true
    })
})
exports.deleteUser=catchAsyncErrors(async(req,res,next)=>{

    const user=await User.findById(req.params.id)

    if(!user){
        return next(new ErrorHandler(`this user is not exist with ${req.params.id}`))
    }
    //  // Remove avatar from cloudinary
    //  const image_id = user.avatar.public_id;
    //  await cloudinary.v2.uploader.destroy(image_id);
     
    //   await user.remove()

    // res.status(200).json({
    //     success:true,
         
    // })

       // Deleting avatar associated with the 

       for (let i = 0; i < user.avatar.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(user.avatar[i].public_id)
    }

    await user.remove();

    res.status(200).json({
        success: true,
        message: 'user is deleted.'
    })

})

// for test purpose of user update
exports.getSingleUser=catchAsyncErrors(async(req,res,next)=>{
    const {id}=req.params
    if(!mongoose.Types.ObjectId.isValid(id)){
       
        return next(new ErrorHandler('user not found',404))
      }
    const user=await User.findById(id)

    if(!user){
          res.status(404).json({
            success:false,
            message:'user not found'
        })
    }{
    res.status(200).json({
        success:true,
        user
    })
}
})
