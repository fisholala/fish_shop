// import DataUriParser from "datauri/parser.js";

// import path from 'path';
// const getDataUri=(file)=>{
//     const parser=new DataUriParser()
//     const extName=path.extName(file.originalName).toString()
//     console.log(extName)
//     return parser.format(extName,file.content)
// }

// export default getDataUri


// exports.registerUser=catchAsyncErrors(async(req,res,next)=>{

//     const{ name,email,passward}= req.body
// // try{
// //     const result=await cloudinary.uploader.upload(req.file.path)

    
//    const result=await cloudinary.uploader.upload(req.body.avatar,{
//       folder:'avatars',
//       width:150,
//       crop:"scale"
//    })

//    // upload.single("avatar")
// //     const user=new user({
// //         name:req.body.name,
// //         email:req.body.email,
// //         passward:req.body.passward,
// //         avatar:{
// //                      public_id:result.public_id,
// //                      url:result.secure_url
// //             }
// //     })
// //     await user.save()
// //     res.json(result)
// // }catch(error) {
// //     console.log(error)
   
//       const user= await User.create({
//        name,
//        email,
//        passward,
//        avatar:{
//            public_id:result.public_id,
//            url:result.secure_url
//        }
//    })
//    console.log(result)
//    sendToken(user,200,res)



//     const token= user.getJwtToken()

//  res.status(201).json({
//     success:true,
//     token
//     // user
//  })
