const express = require("express");

const bodyParser = require("body-parser")

const connDb = require("./config/db_connection");

//for sending cookie
const cookieParser = require("cookie-parser");

//for file uploading (photo)
const fileUpload = require("express-fileupload");

//getting path
const path = require("path")
const cors = require("cors");
const dotenv = require("dotenv");

//load env vars
dotenv.config({
    path: "./config/config.env"
});
//for security
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");

//coloring
const colors = require("colors");

//connect to database
connDb();

const PORT = process.env.PORT || 2500;
const mode = process.env.NODE_ENV;
const {
    bootcamps
} = require("./routes/bootcamp");

//getting routing path
const morgan = require("morgan");

const {
    errorHandler
} = require("./middleware/error");

const {
    courses
} = require("./routes/courses");

const {
    userAuth
} = require("./routes/auth");

const {
    adminRoutes
} = require("./routes/user");
const {
    Reviews
} = require("./routes/reviews");

//initializing application
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
    extended: true
}))
// sanitizing mongo db
app.use(mongoSanitize());

//cors
app.use(cors());

//set security headers
app.use(helmet());

//prevent xss scripting attacks
app.use(xss());

//rate limiting
const limiter = rateLimit({
    windowMs: 10 * 1000 * 60, //=10 min
    max: 100
})

//prevent http param pollution
app.use(hpp());

//Mount route files
app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', userAuth);
app.use('/api/v1/auth/users', adminRoutes);
app.use("/api/v1/reviews", Reviews)
app.use(errorHandler)
const server = app.listen(PORT, console.log(`server is running in ${mode} mode on port ${PORT}`.yellow.bold));

//handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    server.close(() => process.exit(1));
})