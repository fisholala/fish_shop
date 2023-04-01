const mongoose = require('mongoose');
mongoose.set('strictQuery',true)
const connectDatabase=()=> {
    mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser:true,
        useUnifiedTopology:true,
        // useCreateIndex:true
    }).then(con=>{
        console.log('mongodb connect')
    })
}
module.exports= connectDatabase