const express = require("express");
const bodyParser=require("body-parser")
const connDb = require("./config/db_connection");
//for sending cookie
const cookieParser = require("cookie-parser");
//for file uploading (photo)
const fileUpload = require("express-fileupload");
//getting path
const path = require("path")

const dotenv = require("dotenv");
//load env vars
dotenv.config({
    path: "./config/config.env"
});

const colors = require("colors");

//connect to database
connDb();

const PORT = process.env.PORT || 2500;
const mode = process.env.NODE_ENV;
const {
    bootcamps
} = require("./routes/bootcamp");
const morgan = require("morgan");
const { errorHandler } = require("./middleware/error");
const { courses } = require("./routes/courses");
const { userAuth } = require("./routes/auth");
const app = express();

//Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}

//uploading a photo
app.use(fileUpload());

//setting static folder
app.use(express.static(path.join(__dirname, 'public')))

//cookie
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}))

//Mount route files
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses)
app.use('/api/v1/auth',userAuth)
app.use(errorHandler)
const server = app.listen(PORT, console.log(`server is running in ${mode} mode on port ${PORT}`.yellow.bold));

//handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    server.close(() => process.exit(1));
})