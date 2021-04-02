const { ErrorResponse } = require("../utils/errorResponse")
const errorHandler=(err,req,res,next)=>{
    let error={...err}
    error.message=err.message
    //console
   // console.log(err.stack.red);
   //console.log(err.name);
  // console.log(err.value);
   if (err.name==="CastError") {
       const message=`resource not found with id: ${err.value}`
       error=new ErrorResponse(message,400)
   }
    res.status(error.statusCode || 500).send({
        succes:false,
        error:error.message || "server error"
    })
}
module.exports.errorHandler=errorHandler;