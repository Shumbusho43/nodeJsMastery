const mongoose = require("mongoose");
const bootcampSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "bootcamp name is required"],
    unique: [true, "this name is taken"],
    trim: true,
    maxlength: [50, "name can not go beyond 50 characters"],
    minlength: [5, "name can not be below 5 characters"],
  },
  slug: String,
  description: {
    type: String,
    require: [true, "description is required"],
    maxlength: [500, "description can not go beyond 500 characters"],
    minlength: [10, "description can not be below 5 characters"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "please use a valid url which starts with http/https",
    ],
  },
  phone: {
    type: String,
    max: [20, "phone number must not exceed 20 numbers"],
  },
  email: {
    type: String,
    match: [
      /^([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)@([0-9a-zA-Z]([-_\\.]*[0-9a-zA-Z]+)*)[\\.]([a-zA-Z]{2,9})$/,
      "please enter a valid email address",
    ],
  },
  address: {
    type: String,
    required: [true, "please provide your address"],
  },
  location: {
    //using GEOJSON
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      //required: true,
    },
    coordinates: {
      type: [Number],
      //required: true,
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  careers: {
    type: [String],
    require: true,
    enum: ["Web development", "Mobile development", "Data science", "others"],
  },
  averageRating: {
    type: Number,
    min: [1, "rating must be >0"],
    max: [10, "rating must be <11"]
  },
  averageCost: Number,
  photo:{
      type:String,
      default:"./noPhoto.png"
  },
  housing:{
      type:Boolean,
      default:false
  }
  , jobAssistance:{
      type:Boolean,
      default:false
  },
   jobGuarantee:{
      type:Boolean,
      default:false
  },
   acceptGi:{
      type:Boolean,
      default:false
  },
  createdAt:{
      type:Date,
      default:Date.now
  }
});
module.exports.bootcamps=mongoose.model("BootCamp",bootcampSchema);
