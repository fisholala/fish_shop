// const ErrorHandler=require('../utils/errorhandler').default
const ErrorHandler=require('../utils/errorhandler')
module.exports=(err,req,res,next)=>{
    err.statuscode=err.statuscode || 500
    if(process.env.NODE_ENV ==='DEVELOPMENT'){
    res.status(err.statuscode).json({
        success:false,
        error:err,
        errmassage:err.massage ,
        stack:err.stack
    })
    }
    if(process.env.NODE_ENV ==='PRODUCTION'){
let error={...err}
error.massage=err.massage

if(err.name==='CastError'){
    const message=`Resource not found, Invalid:${err.path}`
    error= new ErrorHandler(message,400)
}
if(err.name==='ValidatorError'){
    const message=object.values(err.errors).map(value => value.message)
    error=new ErrorHandler(message,400)
}
// handling mongoose duplicate key error(double registration)
if(err.code === 11000 ){
    const message=`Duplicate ${Object.keys(err.keyValue)} entered`
     error=new ErrorHandler(message,400)
}
// wrong jwt error
if(err.name==='JsonWebTokenError'){
    const message='JSON web token is invalid. try again!!'
    error=new ErrorHandler(message,400)
}
 // expired jwt error
if(err.name==='TokenExpiredError'){
    const message='JSON web token is Expired. try again!!'
    error=new ErrorHandler(message,400)
}   

//  res.status(err.statuscode).json({
//         success:false,
//         message: error.message || 'internal server error',
//         stack:err.stack
//     })

    res.status(err.statuscode).json({
    success:false,
    error:err,
    errmassage:err.massage ,
    stack:err.stack
    })
}
}