const { ErrorResponse } = require("../utils/errorResponse")
const errorHandler=(err,req,res,next)=>{
    let error={...err}
    error.message=err.message
    //console
   console.log(err);
   //console.log(err.name);
  // console.log(err.value);
    //mongoose bad requiest object id
   if (err.name==="CastError") {
       const message=`resource not found with id: ${err.value}`
       error=new ErrorResponse(message,500)
    }
    //mongoose duplicate key
    if (err.code===11000) {
       const message=`Duplicate field key value entered`
       error=new ErrorResponse(message,400)
    }
    if (err.name=== "ValidationError") {
       const message=Object.values(err.errors).map(val=>val.message)
       error=new ErrorResponse(message,400)
   }
    res.status(error.statusCode || 500).send({
        succes:false,
        error:error.message || "server error"
    })
}
module.exports.errorHandler=errorHandler;