/**
 * @param status
 * @param message
 * @param count
 * @param pagination
 * @param data
 * @returns {{status:number,message:string,count:number,pagination:number,data:*}}
 */
exports.formatResult = ({ status = 200, message = "ok",count=1,pagination=1, data }) => {
  return {
    status: status,
    message: message.toString().split('\"').join(""),
    count: count,
    pagination: pagination,
    data: data
  };
};
exports.ONE_DAY = 1 * 24 * 60 * 60;
