const express = require("express");
const bodyParser=require("body-parser")
const connDb = require("./config/db_connection");
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
const app = express();
//Dev logging middleware
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}))
//Mount route files
app.use('/api/v1/bootcamps', bootcamps);

const server = app.listen(PORT, console.log(`server is running in ${mode} mode on port ${PORT}`.yellow.bold));

//handle unhandled promise rejection
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red.bold);
    server.close(() => process.exit(1));
})