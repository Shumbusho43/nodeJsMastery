const mongoose = require("mongoose");
const connectDb = async () => {
    const conn = mongoose.connect(process.env.MONGO_URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
    console.log(`connected  to database: ${process.env.MONGO_URI}`.cyan.underline.bold);
}
module.exports = connectDb;