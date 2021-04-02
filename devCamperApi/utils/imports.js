/**
 * @param status
 * @param message
 * @param count
 * @param data
 * @returns {{status:number,message:string,count:number,data:*}}
 */
exports.formatResult = ({ status = 200, message = "ok",count=0, data }) => {
  return {
    status: status,
    message: message.toString().split('\"').join(""),
    count:count,
    data: data
  };
};
